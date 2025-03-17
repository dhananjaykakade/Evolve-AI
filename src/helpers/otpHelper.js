import redis from "../utils/redis.js";

/**
 * Generates a random 6-digit OTP.
 * The OTP is generated as a string.
 * @returns {string} The generated 6-digit OTP.
 */

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
/**
 * Validates the OTP stored in Redis for a user.
 * @param {string} email - The user's email.
 * @param {string} otp - The OTP entered by the user.
 * @returns {Promise<boolean>} - Returns true if OTP is valid, otherwise false.
 */
const isOtpValid = async (email, otp) => {
  // Retrieve OTP from Redis
  const storedOtp = await redis.get(`otp:${email}`);
  // If OTP does not exist or does not match, reject the promise
  if (!storedOtp || storedOtp !== otp) {
    return false;
  }

  // Check if OTP exists and matches
  return storedOtp && storedOtp === otp;
};
  
  export { generateOtp, isOtpValid };