const { AppError, NotFoundError } = require('../errors');

function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}

// Express 5 forwards rejected promises from async handlers here automatically.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Malformed JSON body from express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Invalid JSON body' } });
  }

  if (err instanceof AppError) {
    // Expected errors: no stack trace needed, just what went wrong.
    req.log.warn({ errType: err.name, details: err.details }, err.message);
    return res.status(err.status).json({ error: { message: err.message, details: err.details } });
  }

  // Unknown error: log full stack, don't leak internals to the client.
  req.log.error({ err }, 'unhandled error');
  res.status(500).json({ error: { message: 'Internal server error' } });
}

module.exports = { notFoundHandler, errorHandler };
