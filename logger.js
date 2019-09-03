const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  // format: winston.format.json(),
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  defaultMeta: {},
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()    
  ]
});

module.exports = logger;