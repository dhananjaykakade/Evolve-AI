import winston from "winston";
import chalk from "chalk"; // ✅ No warning

import DailyRotateFile from "winston-daily-rotate-file";

// Log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Chalk colors for different levels
const logColors = {
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  info: chalk.green,
  http: chalk.cyan,
  verbose: chalk.magenta,
  debug: chalk.blue,
  silly: chalk.gray,
};

// Winston Logger Configuration
const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      const colorFn = logColors[level] || chalk.white;
      const coloredLevel = colorFn(level.toUpperCase());
      const coloredTimestamp = chalk.gray(`[${timestamp}]`);
      const processInfo = chalk.yellow(`(PID: ${process.pid})`);
      const memoryUsage = chalk.cyan(
        `(Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB)`
      );
      return `${coloredTimestamp} ${coloredLevel}: ${message} ${processInfo} ${memoryUsage}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "info",
    }),
  ],
});

// Middleware for logging HTTP requests (if using Express)
const httpLogger = (req, res, next) => {
  logger.http(`${req.method} ${req.url} - ${req.ip}`);
  next();
};

export { logger, httpLogger };
