import net from "net";
import { logger } from "./logger.js";

/**
 * Check if the given port is available.
 * @param {number} port - The port number to check.
 * @returns {Promise<boolean>} Resolves `true` if the port is available, `false` if it's in use.
 */
export const checkPortAvailability = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        logger.warn(`⚠️ Port ${port} is already in use.`);
        resolve(false);
      } else {
        logger.error(`Error while checking port ${port}:`, err);
        resolve(false);
      }
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port);
  });
};
