import nodemailer from "nodemailer";
import config from "../config/config.js";
import { logger } from "../utils/logger.js";

let {EMAIL_USER, EMAIL_PASS} = config;

const transporter = nodemailer.createTransport({
  service: "Gmail", // Change if using another provider
  auth: {
    user: EMAIL_USER, // Your email
    pass: EMAIL_PASS, // Your email password or app password
  },
});

const sendEmail = async (to, subject, body) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`, // Sender
      to,
      subject,
      html: body, // Supports HTML emails
    });

    
    logger.info(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    throw error;
  }
};

export default sendEmail;
