/**
 * Simple request logging middleware.
 * Runs for every incoming request, logs method + path, then calls next().
 */
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
