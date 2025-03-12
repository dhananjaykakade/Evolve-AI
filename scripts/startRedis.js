// src/scripts/startRedis.js
import os from "os";
import { execSync, exec } from "child_process";
import { logger } from "../src/utils/logger.js";

const startRedis = () => {
  try {
    const isWindows = os.platform() === "win32";
    exec(isWindows ? 'tasklist | findstr /i memurai' : 'pgrep redis-server', (err, stdout) => {
      if (!err && stdout.trim()) {
        logger.info("✅ Redis is already running.");
        return;
      }

      logger.info("🔄 Starting Redis server...");
      if (isWindows) {
        try {
          execSync('powershell -Command "Stop-Process -Name memurai -Force"', { stdio: "ignore" });
          logger.info("🛑 Stopped existing Memurai process.");
        } catch (killError) {
          logger.warn("⚠️ Memurai was not running or could not be stopped.");
        }

        exec('start /B memurai.exe', (startErr) => {
          startErr ? logger.error("❌ Failed to start Memurai:", startErr.message)
                   : logger.info("✅ Memurai started successfully.");
        });
      } else {
        try {
          execSync("pkill redis-server", { stdio: "ignore" });
          logger.info("🛑 Stopped existing Redis process.");
        } catch (killError) {
          logger.warn("⚠️ Redis was not running or could not be stopped.");
        }

        exec("redis-server", (startErr) => {
          startErr ? logger.error("❌ Failed to start Redis:", startErr.message)
                   : logger.info("✅ Redis started successfully.");
        });
      }
    });
  } catch (error) {
    logger.error("❌ Unexpected error while managing Redis:", error.message);
  }
};

export default startRedis;
