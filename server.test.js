import { runPreStartChecks } from "./serverChecks.js";
import config from "./src/config/config.js";
import { logger } from "./src/utils/logger.js";

const PORT = config.PORT;

/**
 * Run Pre-Start Checks
 */


const runTests = async () => {
  try {
   
logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
logger.info("🧪 Running pre-start checks...");
logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    await runPreStartChecks(PORT);
    logger.info("✅ All pre-start checks passed successfully!");
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if(config.NODE_ENV === 'test'){
        process.exit(0);  // Exit with success status in tests environment  // 0 for success status in Node.js

    }
  } catch (error) {
    logger.error("❌ Pre-start checks failed:", error.message);
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(1);
    
  }
};


// Run only if executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runTests();
}

export { runTests}