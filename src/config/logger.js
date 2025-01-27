// src/config/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json() // or format.simple() if you prefer plain text
  ),
  defaultMeta: { service: 'vehicle-maintenance-recorder' },
  transports: [
    // Log everything (info and above) to console
    new transports.Console({
      level: process.env.CONSOLE_LOG_LEVEL || 'info',
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
    // Optionally add a file transport
    /*
    new transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new transports.File({
      filename: 'logs/combined.log'
    })
    */
  ],
});

module.exports = logger;
