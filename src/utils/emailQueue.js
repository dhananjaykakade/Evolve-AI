import { Queue } from "bullmq";
import redis from "../utils/redis.js";

const emailQueue = new Queue("emailQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 5, // Retry failed jobs 5 times
    backoff: { type: "exponential", delay: 5000 }, // 5s backoff on failure
    removeOnComplete: true,
    removeOnFail: false, // Keep failed jobs for debugging
  },
});

export default emailQueue;
