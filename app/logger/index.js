const winston = require('winston'),
  fs = require('fs'),
  config = require('../../config'),
  logDir = './app/logger/logs';
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
  fs.mkdirSync(`${logDir}/history`);
}

const tsFormat = () => new Date().toLocaleTimeString();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: false,
      prettyPrint: true
    }),
    new winston.transports.File({
      name: 'complete',
      filename: `${logDir}/complete.log`,
      timestamp: tsFormat,
      json: false,
      colorize: true,
      prettyPrint: true
    }),
    new winston.transports.File({
      name: 'errors',
      filename: `${logDir}/errors.log`,
      timestamp: tsFormat,
      colorize: true,
      json: false,
      level: 'error',
      prettyPrint: true,
      handleExceptions: config.loggerHandlesExceptions,
      humanReadableUnhandledException: config.loggerHandlesExceptions
    }),
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/history/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd.',
      colorize: true,
      prepend: true,
      json: false,
      level: 'info',
      prettyPrint: true
    })
  ]
});

module.exports = logger;
