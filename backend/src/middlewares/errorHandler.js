const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, { 
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip
  });

  // Define error response
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorDetails = undefined;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Validation Error';
    errorDetails = err.details;
  } else if (err.name === 'UnauthorizedError' || err.message.includes('jwt')) {
    statusCode = 401;
    errorMessage = 'Authentication Error';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorMessage = 'Access Denied';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = 'Resource Not Found';
  } else if (err.name === 'SequelizeError' || err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errorMessage = 'Database Error';
    errorDetails = err.errors?.map(e => ({ 
      field: e.path, 
      message: e.message 
    }));
  } else if (err.name === 'ApiIntegrationError') {
    statusCode = 502;
    errorMessage = 'External API Error';
    errorDetails = err.details;
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message: errorMessage,
      details: errorDetails,
      code: err.code || null
    }
  });
};

module.exports = errorHandler;
