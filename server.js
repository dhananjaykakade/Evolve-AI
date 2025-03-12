// server.js
import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";
import config from "./src/config/config.js";
import http from "http";
import { EventEmitter } from "events";
import startRedis from "./scripts/startRedis.js";
import killProcessOnPort from "./scripts/killProcess.js";
import executeServerTests from "./scripts/serverTestRunner.js";

EventEmitter.defaultMaxListeners = 20;
const PORT = config.PORT || 9000;
let server;
let shuttingDown = false; // Prevent multiple shutdown attempts

/**
 * Start the server safely, ensuring no duplicate instances
 */
const startServer = async (port = PORT, retries = 3) => {
  if (retries === 0) {
    logger.error("❌ Unable to find an open port after multiple attempts. Exiting...");
    process.exit(1);
  }

  try {
    await executeServerTests();
    killProcessOnPort(port);
    startRedis();

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
