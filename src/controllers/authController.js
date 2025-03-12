import prisma from "../utils/prisma.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js"
import { generateToken, verifyToken } from "../helpers/jwt.js"
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

    ResponseHandler.success(res, 200, "Login successful", { user, token });
});
