
import express from "express";
import { registerUser ,loginUser,verifyOtp,resendOtp,refreshToken,logoutUser,getUserProfile} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.get("/profile",authMiddleware, getUserProfile);

export default router;
