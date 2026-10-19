require('dotenv').config({ quiet: true });

// Single source of truth for configuration. Nothing else reads process.env.
const config = {
  port: Number(process.env.PORT) || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  http: {
    timeoutMs: Number(process.env.HTTP_TIMEOUT_MS) || 5000,
  },
};

module.exports = config;
