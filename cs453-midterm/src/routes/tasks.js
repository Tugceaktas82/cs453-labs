const express = require('express');
const router = express.Router();
const tasksData = require('../data/tasks');
const validateTask = require('../middleware/validateTask');

/**
 * GET /api/tasks
 * Returns all tasks.
 * 200 OK with an array of tasks.
 */
router.get('/', (req, res) => {
  res.status(200).json(tasksData.getAll());
});

/**
 * GET /api/tasks/:id
 * Returns one task, or 404 if it doesn't exist.
 */
router.get('/:id', (req, res) => {
  const task = tasksData.getById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.status(200).json(task);
});

/**
 * POST /api/tasks
 * Creates a new task. The server assigns the id.
 * 201 Created with the new resource, 400 Bad Request if validation fails.
 */
router.post('/', validateTask('create'), (req, res) => {
  const { title, course, completed } = req.body;
  const newTask = tasksData.create({ title, course, completed });
  res.status(201).json(newTask);
});

/**
 * PUT /api/tasks/:id
 * Replaces an existing task entirely (all fields required).
 * 200 OK if replaced, 404 Not Found if the task doesn't exist,
 * 400 Bad Request if required fields are missing/invalid.
 */
router.put('/:id', validateTask('replace'), (req, res) => {
  const { title, course, completed } = req.body;
  const updated = tasksData.replace(req.params.id, { title, course, completed });

  if (!updated) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.status(200).json(updated);
});

/**
 * PATCH /api/tasks/:id
 * Partially updates an existing task (only provided fields change).
 * 200 OK if updated, 404 Not Found if the task doesn't exist,
 * 400 Bad Request if provided fields are invalid or none are provided.
 */
router.patch('/:id', validateTask('patch'), (req, res) => {
  const updated = tasksData.patch(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.status(200).json(updated);
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task.
 * 204 No Content if deleted, 404 Not Found if it doesn't exist.
 */
router.delete('/:id', (req, res) => {
  const deleted = tasksData.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.status(204).send();
});

module.exports = router;
