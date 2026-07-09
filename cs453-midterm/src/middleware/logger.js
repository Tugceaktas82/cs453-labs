/**
 * Request logging middleware.
 * Logs: HTTP method, path, response status code, and time taken (ms).
 *
 * We can't know the final status code or duration until the response
 * has actually finished sending, so we listen for the 'finish' event
 * on `res` (fired after Express sends the response) rather than logging
 * immediately. next() is still called right away so the request isn't
 * blocked waiting for its own response.
 */
function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`
    );
  });

  next();
}

module.exports = requestLogger;
