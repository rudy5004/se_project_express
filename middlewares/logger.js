const winston = require("winston");
const expressWinston = require("express-winston");

// Custom formatter for log messages
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
      format: winston.format.json(), // For detailed file logs
    }),
  ],
  format: messageFormat,
  meta: true, // Optional: Log metadata such as the request and response objects
  msg: "HTTP {{req.method}} {{req.url}}", // Log HTTP method and URL
  expressFormat: true, // Use the default Express-Winston request format
  colorize: false, // Disable colors in file logs
});

// Error logger
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "error.log",
      format: winston.format.json(), // Log errors in JSON format for easier analysis
    }),
  ],
  format: messageFormat,
});

module.exports = {
  requestLogger,
  errorLogger,
};
