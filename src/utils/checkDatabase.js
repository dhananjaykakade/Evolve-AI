import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

const prisma = new PrismaClient();

export const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Database connection successful.");
  } catch (error) {
    logger.error("❌ Database connection failed:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};


