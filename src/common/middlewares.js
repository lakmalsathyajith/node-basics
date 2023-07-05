const { StatusCodes } = require('http-status-codes');

const invalidRouteErrorMiddleware = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 'failed',
    message: `Cannot find ${req.originalUrl}`,
  });
};

const globalErrorCatcher = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = {
  invalidRouteErrorMiddleware,
  globalErrorCatcher,
};
