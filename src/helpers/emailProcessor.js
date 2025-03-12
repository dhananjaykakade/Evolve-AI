import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import sendEmail from "../service/emailService.js"; // Assume you have a function for sending emails
import { logger } from "../utils/logger.js";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    logger.info(`Processing email job: ${job.id}`);
    
    const { to, subject, body } = job.data;
    await sendEmail(to, subject, body); // Replace with your actual email logic
    
    console.log(`✅ Email sent to ${to}`);
    logger.info(`Email sent to ${to}`);
    
  },
  { connection: redis, concurrency: 5 } // Process 5 jobs in parallel
);

worker.on("failed", (job, err) => {
    logger.error(`Email job ${job.id} failed:`, err);
});

worker.on("completed", (job) => {
  logger.info(`Email job ${job.id} completed successfully`);
});

export default worker;
