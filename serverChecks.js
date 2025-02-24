import { checkPortAvailability } from "./src/utils/checkPort.js";
import { checkDatabaseConnection } from "./src/utils/checkDatabase.js";
import config from "./src/config/config.js";
import { checkRequiredFolders } from "./src/utils/checkFolders.js";
import { logger } from "./src/utils/logger.js";

/**
 * Run all necessary pre-start checks before launching the server
 */
export const runPreStartChecks = async (PORT) => {
  try {
    await checkPortAvailability(PORT);
    await checkDatabaseConnection();
    config.validateEnvVariables();
    checkRequiredFolders();
    logger.info("✅ All pre-start checks passed. Starting the server...");
  } catch (error) {
    logger.error("❌ Pre-start check failed:", error.message);
    process.exit(1);
  }
};
