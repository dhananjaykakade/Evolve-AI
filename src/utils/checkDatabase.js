import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

const prisma = new PrismaClient();

/**
 * Check database connection with retries.
 */
export const checkDatabaseConnection = async (retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`🔄 Attempting database connection... (Attempt ${attempt}/${retries})`);
      await prisma.$connect();
      logger.info("✅ Database connection successful.");
      return; // Exit function on success
    } catch (error) {
      logger.error(`❌ Database connection failed: ${error.message}`);
      if (attempt < retries) {
        logger.warn(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        logger.error("❌ All retries failed. Exiting...");
        process.exit(1); // Stop the server if all attempts fail
      }
    }
  }
};

/**
 * Gracefully disconnect Prisma on shutdown.
 */
const handleExit = async () => {
  try {
    logger.info("🔌 Disconnecting from the database...");
    await prisma.$disconnect();
    logger.info("✅ Database disconnected successfully.");
  } catch (error) {
    logger.error(`⚠️ Error disconnecting from the database: ${error.message}`);
  } finally {
    process.exit(0);
  }
};

// Handle process termination signals
process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);
