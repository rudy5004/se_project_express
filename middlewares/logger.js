const winston = require("winston");
const expressWinston = require("express-winston");

// Create a custom format for logging
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta?.error?.stack || message}`
  )
);

// Request logger
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "request.log",
      format: winston.format.json(), // Log in JSON format to the file
    }),
  ],
  meta: true, // Include meta information about the request
  expressFormat: true, // Format request logs in a concise format for the console
  colorize: false, // Disable colorization for file logs
});

// Error logger
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "error.log",
      format: winston.format.json(), // Log in JSON format to the file
    }),
  ],
});

module.exports = {
  requestLogger,
  errorLogger,
};
