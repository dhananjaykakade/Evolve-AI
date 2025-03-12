import jwt from "jsonwebtoken";
import config from "../config/config.js"

let {JWT_SECRET} = config


/**
 * Generates a JWT token for a given user.
 * Signs the user's ID and role with a secret key, expiring in 1 hour.
 * @param {object} user - The user object containing id and role.
 * @returns {string} The generated JWT token.
*/
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
};


/**
 * Verifies a JWT token.
 * Decodes the token and verifies its signature against the secret key.
 * @param {string} token - The JWT token to verify.
 * @returns {object} The decoded payload if the token is valid.
 */

const verifyToken = (token) => {
  return jwt.verify(token,JWT_SECRET);
};

export { generateToken, verifyToken };