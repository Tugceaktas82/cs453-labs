const express = require('express');
const router = express.Router();
const tasksData = require('../data/tasks');
const validateTask = require('../middleware/validateTask');

//GET /api/tasks - list everything
router.get('/', (req, res) => {
  res.status(200).json(tasksData.getAll());
});

//GET /api/tasks/:id
router.get('/:id', (req, res) => {
  const task = tasksData.getById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.status(200).json(task);
});

//POST /api/tasks - server assigns the id
router.post('/', validateTask('create'), (req, res) => {
  const { title, course, completed } = req.body;
  const newTask = tasksData.create({ title, course, completed });
  res.status(201).json(newTask);
});

//PUT /api/tasks/:id - full replace, all fields required
router.put('/:id', validateTask('replace'), (req, res) => {
  const { title, course, completed } = req.body;
  const updated = tasksData.replace(req.params.id, { title, course, completed });

  if (!updated) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.status(200).json(updated);
});

//PATCH /api/tasks/:id - only updates the fields sent in the body
router.patch('/:id', validateTask('patch'), (req, res) => {
  const updated = tasksData.patch(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.status(200).json(updated);
});

//DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const deleted = tasksData.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
  }

  res.status(204).send();
});

module.exports = router;