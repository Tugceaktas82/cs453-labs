// logs method, path, status code and duration for each request.
// status code isn't known until the response actually finishes, so we
// hook into the 'finish' event instead of logging right away
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