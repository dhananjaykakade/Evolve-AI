import { Redis } from "ioredis";
import { logger } from "./logger.js";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // Avoid unnecessary reconnections
  enableReadyCheck: false, // Optimize connection handling
  reconnectOnError: (err) => {
    console.error("🔴 Redis error:", err);
    return true; // Auto-reconnect
  },
});

redis.on("connect", () => logger.info("redis connected"));
redis.on("error", (err) => logger.error("redis error", err));


export default redis;
