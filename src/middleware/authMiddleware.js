import { verifyToken } from "../helpers/jwt.js";
import ResponseHandler from "../utils/CustomResponse.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return ResponseHandler.unauthorized(res, "Access token required");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user info to request
        console.log("decoded",decoded)
        next(); // Continue to controller
    } catch (error) {
        return ResponseHandler.unauthorized(res, "Invalid or expired access token");
    }
};

export default authMiddleware;
