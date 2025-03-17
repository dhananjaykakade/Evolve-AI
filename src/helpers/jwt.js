import jwt from "jsonwebtoken";
import config from "../config/config.js"

let {JWT_SECRET,JWT_REFRESH_SECRET } = config
/**
 * Generates an access token (short-lived)
 */
export const generateToken = (user) => {
    return jwt.sign({ Id: user.Id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
};

/**
 * Generates a refresh token (long-lived)
 */
export const generateRefreshToken = (user) => {
    return jwt.sign({ Id: user.Id, role: user.role }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

/**
 * Verifies an access token
 */
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

/**
 * Verifies a refresh token
 */
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
};
