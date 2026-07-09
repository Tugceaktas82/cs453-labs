// needs 4 args or Express won't treat it as an error handler.
// anything passed via next(err) ends up here - just send a generic
// 500 back instead of leaking the stack trace to the client
function errorHandler(err, req, res, next) {
  console.error('Unexpected error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server.',
  });
}

module.exports = errorHandler;