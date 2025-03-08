import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";
import config from "./src/config/config.js";
import http from "http";
import { execSync } from "child_process";
import { runTests } from "./serverTest.js";
import os from "os";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;

const PORT = config.PORT || 9000;
let server;
let shuttingDown = false; // Prevent multiple shutdown attempts

/**
 * Kill any process running on the given port, using OS-specific commands
 */
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

/**
 * Start the server safely, ensuring no duplicate instances
 */
const startServer = async (port = PORT, retries = 3) => {
  if (retries === 0) {
    logger.error("❌ Unable to find an open port after multiple attempts. Exiting...");
    process.exit(1);
  }

  try {
  
    await runTests();

    // execute the tests with npm test runner with jest if environment is production 

    if (config.NODE_ENV === "production") {
      logger.info("🔥 Running tests in production environment...")
      execSync("npm test")
    }
    killProcessOnPort(port);

    

    server = http.createServer(app);

    server.listen(port, () => {
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info(`🚀 Server running in ${config.NODE_ENV} mode on http://localhost:${port} (PID: ${process.pid})`);
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.warn(`⚠️ Port ${port} is in use. Retrying on port ${port + 1}...`);
        setTimeout(() => startServer(port + 1, retries - 1), 1000);
      } else {
        logger.error(`❌ Server startup failed: ${error.message}`);
        process.exit(1);
      }
    });

  } catch (error) {
    logger.error(`❌ Fatal Error during startup: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handling
 */
const setupShutdownHandlers = () => {
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.warn(`🛑 Received ${signal}, shutting down gracefully...`);

    if (server) {
      server.close(() => {
        logger.info("✅ Server closed. Exiting process...");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

process.on('uncaughtException', (error) => {
  logger.error(`❌ Uncaught Exception: ${error.message}\n${error.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`❌ Unhandled Rejection: ${reason}\n${reason?.stack || ''}`);
  process.exit(1);
});

// Start the server and setup handlers
startServer();
setupShutdownHandlers();

export { killProcessOnPort };
