import express from "express";
import emailQueue from "../utils/emailQueue.js";
import ResponseHandler from "../utils/CustomResponse.js";
import CustomError from "../utils/CustomError.js";
import {logger} from "../utils/logger.js";

const router = express.Router();

router.post("/send-email", async (req, res,next) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        // Return 400 Bad Request if any required fields are missing.
        // You might want to add more specific error messages for each field.
        // For example, you could return "Missing 'to' field", "Missing'subject' field", etc.
        return ResponseHandler.badRequest(res, "Missing email parameters");
    }
    const job = await emailQueue.add("sendEmail", { to, subject, body });

    ResponseHandler.success(res, 200,"Email sent successfully", { jobId: job.id });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    next(new CustomError());
  }
});

export default router;
