const express = require('express');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Global middleware (runs on every request, in this order) ---
app.use(express.json());   // parses JSON bodies into req.body
app.use(requestLogger);    // logs every incoming request

// --- Health check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Course Task Tracker API is running' });
});

// --- Resource routes ---
app.use('/api/tasks', tasksRouter);

// --- 404 handler for unmatched routes ---
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// --- Centralized error handler (must be last, has 4 args) ---
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Course Task Tracker API listening on http://localhost:${PORT}`);
});

module.exports = app;
