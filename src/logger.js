const pino = require('pino');
const config = require('./config');

// Structured JSON logs. In dev, `npm run dev` pipes through pino-pretty.
const logger = pino({ level: config.logLevel });

module.exports = logger;
