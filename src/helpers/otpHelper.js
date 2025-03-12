
/**
 * Generates a random 6-digit OTP.
 * The OTP is generated as a string.
 * @returns {string} The generated 6-digit OTP.
 */

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  /**
   * Checks if the provided OTP is valid for the given user.
   * The OTP is valid if it matches the user's stored OTP and has not expired.
   * @param {object} user - The user object containing otp and otpExpiresAt.
   * @param {string} otp - The OTP to validate.
   * @returns {boolean} True if the OTP is valid, false otherwise.
   */
  
  const isOtpValid = (user, otp) => {
    return user.otp === otp && user.otpExpiresAt > new Date();
  };
  
  export { generateOtp, isOtpValid };