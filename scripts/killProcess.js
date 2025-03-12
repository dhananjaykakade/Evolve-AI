// src/scripts/killProcess.js
import os from "os";
import { execSync } from "child_process";
import { logger } from "../src/utils/logger.js";

const killProcessOnPort = (port) => {
  try {
    if (os.platform() === "win32") {
      const output = execSync(`netstat -ano | findstr :${port}`).toString();
      const lines = output.split("\n").filter((line) => line.includes("LISTENING"));

      if (lines.length > 0) {
        const pid = lines[0].trim().split(/\s+/).pop();
        if (pid) {
          logger.warn(`⚠️ Port ${port} is in use. Killing process ${pid}...`);
          try {
            execSync(`taskkill /F /PID ${pid}`);
            logger.info(`✅ Killed process ${pid} on port ${port}`);
          } catch (error) {
            logger.error(`❌ Failed to kill process ${pid}: ${error.message}`);
          }
        }
      }
    } else {
      const output = execSync(`lsof -t -i:${port}`).toString().trim();
      if (output) {
        logger.warn(`⚠️ Port ${port} is in use. Killing process ${output}...`);
        try {
          execSync(`kill -9 ${output}`);
          logger.info(`✅ Killed process ${output} on port ${port}`);
        } catch (error) {
          logger.error(`❌ Failed to kill process ${output}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    logger.info(`ℹ️ No existing process found on port ${port}`);
  }
};

export default killProcessOnPort;
