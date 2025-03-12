import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;


/**
 * Hashes a given password using bcrypt.
 * Asynchronously generates a salt and hashes the password with it.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};


/**
 * Compares a given password with a hashed password using bcrypt.
 * Asynchronously compares the plain text password with the stored hash.
 * @param {string} password - The password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
