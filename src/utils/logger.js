import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const chalk = await import("chalk");

// Detect environment
const isDev = process.env.NODE_ENV !== "production";

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
// Chalk colors for different log levels
const logColors = {
  error: chalk.default.red.bold,
  warn: chalk.default.yellow.bold,
  info: chalk.default.green,
  http: chalk.default.cyan,
  verbose: chalk.default.magenta,
  debug: chalk.default.blue,
  silly: chalk.default.gray,
};

// Console format (prettified output with colors)
const consoleFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  const colorFn = logColors[level] || chalk.default.white;
  const coloredLevel = colorFn(level.toUpperCase());
  const coloredTimestamp = chalk.default.gray(`[${timestamp}]`);
  const processInfo = chalk.default.yellow(`(PID: ${process.pid})`);
  const memoryUsage = chalk.default.cyan(`(Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB)`);
  const stackTrace = stack && isDev ? `\n${chalk.default.red(stack)}` : ""; // Show stack in dev console

  if (message.includes('development'|| 'production')) {
    return `${coloredTimestamp} ${coloredLevel}: ${message} ${processInfo} ${memoryUsage}${stackTrace}`;
  } else {
    // Return the log message without memoryUsage
    return `${coloredTimestamp} ${coloredLevel}: ${message} ${stackTrace}`;
  }
});

// File format (pretty and easy to read)
const fileFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return [
    `----------------------------------------`,
    `Timestamp:  ${timestamp}`,
    `Level:      ${level.toUpperCase()}`,
    `Message:    ${message}`,
    stack ? `Stack Trace:\n${stack}` : null,
    `----------------------------------------`,
  ]
    .filter(Boolean)
    .join("\n");
});

// Winston Logger Configuration
const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }) // Captures stack traces
  ),
  transports: [
    new winston.transports.Console({
      level: isDev ? "debug" : "info",
      format: consoleFormat, // Pretty logs for console
    }),

    // General logs (easy to read format)
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "info",
      format: fileFormat, // Store logs in file format
    }),

    // Error logs with stack traces (formatted properly)
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
      level: "error",
      format: fileFormat, // Ensure stack traces are logged
    }),
  ],
});

// Middleware for logging HTTP requests in Express
const httpLogger = (req, res, next) => {
  const start = process.hrtime(); // Start time for response duration
  res.on("finish", () => {
    const duration = process.hrtime(start);
    const responseTime = (duration[0] * 1e3 + duration[1] / 1e6).toFixed(2); // Convert to ms
    const logMessage = `${req.method} ${req.url} - ${res.statusCode} (${responseTime}ms) - ${req.ip}`;

    if (res.statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.http(logMessage);
    }
  });

  next();
};

export { logger, httpLogger };
