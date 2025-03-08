import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

// Load environment variables from .env file
dotenv.config();

class Config {
  constructor() {
    // Required environment variables
    this.requiredEnvVars = ["PORT", "JWT_SECRET", "DATABASE_URL",];

    // Validate environment variables


    // Application Config
    this.NODE_ENV = process.env.NODE_ENV || "development";
    this.PORT = parseInt(process.env.PORT, 10) || 3000;

    // Security Config
    this.JWT_SECRET = process.env.JWT_SECRET || "default_secret";
    this.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

    // Database Config
    this.DATABASE_URL = process.env.DATABASE_URL;

    // Logging Config
    this.LOG_LEVEL = process.env.LOG_LEVEL || "info";

    // Other Configs
    this.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
    this.API_KEY = process.env.API_KEY || "your-api-key";

    // CORS Config
    this.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["*"];
  }

  /**
   * Validate required environment variables
   */
  validateEnvVariables() {
    const missingVars = this.requiredEnvVars.filter((varName) => !process.env[varName]);


    if (missingVars.length > 0) {
      logger.error(`❌ Missing environment variables: ${missingVars.join(", ")}`);
      process.exit(1); // Exit process if required variables are missing
    }

    logger.info("✅ All required environment variables are set.");
  }

  /**
   * Check if the application is running in production mode
   */
  isProduction() {
    return this.NODE_ENV === "production";
  }

  /**
   * Check if the application is running in development mode
   */
  isDevelopment() {
    return this.NODE_ENV === "development";
  }
}

// Singleton Instance (Ensures config is initialized only once)
const config = new Config();
export default config;
