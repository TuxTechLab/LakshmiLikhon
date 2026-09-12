function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  if (status >= 500) {
    console.error(`[ERROR] ${status} - ${message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
  }

  res.status(status).json({
    error: message,
  });
}

module.exports = errorHandler;
