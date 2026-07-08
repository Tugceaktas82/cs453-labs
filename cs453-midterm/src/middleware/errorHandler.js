/**
 * Centralized error-handling middleware.
 * Express identifies this as an error handler because it takes 4 arguments.
 * Any error passed via next(err) anywhere in the app ends up here, and we
 * respond with a generic 500 instead of leaking a stack trace to the client.
 */
function errorHandler(err, req, res, next) {
  console.error('Unexpected error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server.',
  });
}

module.exports = errorHandler;
