import prisma from "../utils/prisma.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js"
import { generateToken, verifyToken,generateRefreshToken,verifyRefreshToken } from "../helpers/jwt.js"
import { generateOtp, isOtpValid } from "../helpers/otpHelper.js"
// import { sendOTP } from "../helpers/sendOTP.js"
import sendEmail from "../service/emailService.js";
import ResponseHandler from "../utils/CustomResponse.js";
import  apiHandler from "../helpers/ApiHandler.js";
import redis from "../utils/redis.js";

/**
    * Registers a new user in the database.
    * @param {Request} req - The request object.
    * @param {Response} res - The response object.
    * @requires {User} user - The user to register {email,password,role}
    * @returns {Promise<void>}
    */

export const registerUser = apiHandler(async (req, res) => {
    const { email, password, role } = req.body;
    // 2️⃣ Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return ResponseHandler.conflict(res, "User already exists");
    }

    // 3️⃣ Hash Password
    const hashedPassword = await hashPassword(password);

    // 4️⃣ Save user to DB
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            isVerified: !(role === "admin"), // Admin needs email verification
        },
    });

    // 5️⃣ Send Email Verification (for admin only)
    if (role === "admin") {
        await sendVerificationEmail(user.email);
        return ResponseHandler.success(res, 201, "Admin registered. Please verify your email.");

    }

    ResponseHandler.success(res, 201, "User registered successfully");
});


/**
 * Logs in a user.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @requires {User} user - The user to login {email,password}
 * @returns {user,token} - The user object and JWT token.
 */


export const loginUser = apiHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return ResponseHandler.notFound(res, "User not found");
    }

    // 2️⃣ Compare Password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        return ResponseHandler.unauthorized(res, "Invalid credentials");
    }

    // 3️⃣ If user is an admin, generate & send OTP
    if (user.role === "admin") {
        const otp = generateOtp(); // Use our helper function

        // Store OTP in Redis with a 5-minute expiration
        await redis.set(`otp:${email}`, otp, "EX", 300);

        // Send OTP via email
        await sendEmail(email, "Admin Login OTP", `Your OTP is: ${otp}`);

        return ResponseHandler.success(res, 200, "OTP sent to email. Please verify.");
    }

    // 4️⃣ Normal login for non-admin users
    const token = generateToken(user); // Use our helper function
    const refreshToken = generateRefreshToken(user);

    // 5️⃣ Store Refresh Token in Redis (Expires in 7 days)
    await redis.set(`refresh:${user.Id}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
const sanitizeUser = (user) => {
    return { id: user.Id, email: user.email, role: user.role, isVerified: user.isVerified };
};

    ResponseHandler.success(res, 200, "Login successful", { user :sanitizeUser(user), token,refreshToken });
});


/**
 * Verifies OTP for admin login.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @requires {email, otp} - The email and OTP for verification.
 * @returns {user, token} - The user object and JWT token.
 */

export const verifyOtp = apiHandler(async (req, res) => {
    const { email, otp } = req.body;

    // 1️⃣ Check if OTP exists in Redis
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
        return ResponseHandler.unauthorized(res, "OTP expired or invalid.");
    }

    // 2️⃣ Validate OTP
    if (!isOtpValid(storedOtp, otp)) {
        return ResponseHandler.unauthorized(res, "Incorrect OTP.");
    }

    // 3️⃣ OTP is correct - Get user details
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return ResponseHandler.notFound(res, "User not found.");
    }

    // 4️⃣ Generate JWT Token
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    // tore Refresh Token in Redis (expires in 7 days)
    await redis.set(`refresh:${user.Id}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days


    // 5️⃣ Remove OTP from Redis (prevent reuse)
    await redis.del(`otp:${email}`);



    const sanitizeUser = (user) => {
        return { id: user.Id, email: user.email, role: user.role, isVerified: user.isVerified };
    };
    ResponseHandler.success(res, 200, "OTP verified successfully",{ user :sanitizeUser(user), token,refreshToken });
});

// resend OTP
/**
 * Resend OTP for admin login.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @requires {email} - The email to resend OTP.
 * @returns {void}
 */
export const resendOtp = apiHandler(async (req, res) => {
    const { email } = req.body;
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return ResponseHandler.notFound(res, "User not found.");
    }
    // Generate OTP
    const otp = generateOtp();
    // Store OTP in Redis with a 5-minute expiration
    await redis.set(`otp:${email}`, otp, "EX", 300);
    // Send OTP via email
    await sendEmail(email, "Admin Login OTP", `Your OTP is: ${otp}`);
    ResponseHandler.success(res, 200, "OTP sent to email. Please verify.");
});



/**
 * @module refreshToken
 * @description Refreshes the access token using a valid refresh token.
 */

export const refreshToken = apiHandler(async (req, res) => {
    /**
     * Extract refresh token from request body.
     * @constant {string} refreshToken - The refresh token sent by the client.
     */
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return ResponseHandler.badRequest(res, "Refresh token required");
    }

    try {
        /**
         * Decode and verify the refresh token.
         * @constant {Object} decoded - Decoded token payload.
         * @property {string} decoded.id - User ID extracted from the token.
         * @property {string} decoded.role - User role extracted from the token.
         */
        const decoded = verifyRefreshToken(refreshToken);
        const userId = decoded.id;

        /**
         * Check if the refresh token exists in Redis.
         * @constant {string|null} storedToken - Token retrieved from Redis storage.
         */
        const storedToken = await redis.get(`refresh:${userId}`);
        if (!storedToken || storedToken !== refreshToken) {
            return ResponseHandler.unauthorized(res, "Invalid or expired refresh token");
        }

        /**
         * Generate a new access token.
         * @constant {string} newAccessToken - Newly generated access token.
         */
        const newAccessToken = generateToken({ id: userId, role: decoded.role });

        /**
         * Send the new access token in the response.
         */
        ResponseHandler.success(res, 200, "Access token refreshed", { token: newAccessToken });

    } catch (error) {
        return ResponseHandler.unauthorized(res, "Invalid refresh token");
    }
});


// create Logout handler

/**
 * Logs out a user by removing their refresh token from Redis.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @requires {string} refreshToken - The refresh token to invalidate.
 * @returns {Promise<void>}
 */
export const logoutUser = apiHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return ResponseHandler.badRequest(res, "Refresh token required");
    }

    try {
        // 1️⃣ Find the user ID from the stored refresh token
        const keys = await redis.keys("refresh:*");
        let userId = null;

        for (const key of keys) {
            const storedToken = await redis.get(key);
            if (storedToken === refreshToken) {
                userId = key.split(":")[1]; // Extract user ID from key
                break;
            }
        }

        if (!userId) {
            return ResponseHandler.unauthorized(res, "Invalid refresh token");
        }

        // 2️⃣ Remove refresh token from Redis
        await redis.del(`refresh:${userId}`);

        // 3️⃣ Respond with success message
        ResponseHandler.success(res, 200, "Logged out successfully");
    } catch (error) {
        return ResponseHandler.serverError(res, "Logout failed");
    }
});


/**
 * Get the authenticated user's profile
 * @route GET /api/auth/me
 * @access Private (requires access token)
 */
export const getUserProfile = apiHandler(async (req, res) => {
    // 1️⃣ Extract user ID from the request (added by auth middleware)
    const userId = req.user.Id;

    // 2️⃣ Fetch user data from database (exclude password)
    const user = await prisma.user.findUnique({
        where: { Id: userId },
        select: {
            Id: true,
            email: true,
            role: true,
            is2FAEnabled: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        return ResponseHandler.notFound(res, "User not found");
    }

    // 3️⃣ Return user profile
    ResponseHandler.success(res, 200, "User profile fetched successfully", { user });
});

// update user profile
/**
 * Update the authenticated user's profile
 * @route PUT /api/auth/me
 * @access Private (requires access token)
 */

export const updateUserProfile = apiHandler(async (req, res) => {
    // Extract user ID from the request (added by auth middleware)
    const userId = req.user.Id;
    const { email, password } = req.body;
    const updatedUser = await prisma.user.update({
        where: { Id: userId },
        data: { email, password }
    });
    ResponseHandler.success(res, 200, "Profile updated successfully", { user: updatedUser });
}
);

