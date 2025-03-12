// src/scripts/serverTestRunner.js
import { execSync } from "child_process";
import { logger } from "../src/utils/logger.js";
import { runTests } from "../serverTest.js";

const executeServerTests = async () => {
  try {
    await runTests();
    // if (process.env.NODE_ENV === "production") {
    //   logger.info("🔥 Running tests in production environment...");
    //   execSync("npm test", { stdio: "inherit" });
    // }
  } catch (error) {
    logger.error(`❌ Error running tests: ${error.message}`);
  }
};

export default executeServerTests;
