const express = require('express');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Course Task Tracker API is running' });
});

app.use('/api/tasks', tasksRouter);

//no route matched
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

//has to stay last, needs 4 args to be picked up as error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Course Task Tracker API listening on http://localhost:${PORT}`);
});

module.exports = app;