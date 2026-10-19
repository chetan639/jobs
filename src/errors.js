// Domain errors carry an HTTP status so the error middleware can map them
// without services knowing anything about Express.
class AppError extends Error {
  constructor(message, status = 500, details) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, details);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

class UpstreamError extends AppError {
  constructor(message = 'Upstream service failed', details) {
    super(message, 502, details);
  }
}

module.exports = { AppError, ValidationError, NotFoundError, ConflictError, UpstreamError };
