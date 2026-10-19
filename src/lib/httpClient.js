const axios = require('axios');
const config = require('../config');
const logger = require('../logger');
const { UpstreamError } = require('../errors');

// Shared outbound HTTP client: timeout + request/response logging.
// Usage: const { data } = await httpClient.get('https://api.example.com/x');
const httpClient = axios.create({ timeout: config.http.timeoutMs });

httpClient.interceptors.request.use((req) => {
  req.metadata = { start: Date.now() };
  logger.debug({ method: req.method, url: req.url }, 'outbound request');
  return req;
});

httpClient.interceptors.response.use(
  (res) => {
    logger.info(
      { method: res.config.method, url: res.config.url, status: res.status, ms: Date.now() - res.config.metadata.start },
      'outbound response'
    );
    return res;
  },
  (err) => {
    const cfg = err.config || {};
    logger.error(
      { method: cfg.method, url: cfg.url, status: err.response?.status, code: err.code, msg: err.message },
      'outbound request failed'
    );
    // Normalise so callers/handlers get a 502 instead of a raw axios error.
    return Promise.reject(
      new UpstreamError(`Upstream call failed: ${err.message}`, { url: cfg.url, status: err.response?.status })
    );
  }
);

module.exports = httpClient;
