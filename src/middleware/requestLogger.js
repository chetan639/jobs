const pinoHttp = require('pino-http');
const { randomUUID } = require('node:crypto');
const logger = require('../logger');

// Logs every request/response and exposes req.log (a child logger tagged with reqId).
module.exports = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const id = req.headers['x-request-id'] || randomUUID();
    res.setHeader('x-request-id', id);
    return id;
  },
  // Keep request logs to one readable line: drop headers, remote address, etc.
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
  customLogLevel: (req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});
