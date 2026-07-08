/**
 * In-memory "database" for tasks — just a plain array.
 * No real database is used, per the exam's requirements.
 * Data resets whenever the server restarts.
 */
let tasks = [
  { id: '1', title: 'Watch Week 3 lecture', course: 'CS453', completed: false },
  { id: '2', title: 'Submit Assignment 2', course: 'CS453', completed: false },
  { id: '3', title: 'Read Chapter 5', course: 'CS210', completed: true },
];

let nextId = 4;

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find((t) => t.id === id);
}

function create({ title, course, completed }) {
  const newTask = {
    id: String(nextId++),
    title,
    course,
    completed: completed === undefined ? false : completed,
  };
  tasks.push(newTask);
  return newTask;
}

function replace(id, { title, course, completed }) {
  const task = getById(id);
  if (!task) return null;
  task.title = title;
  task.course = course;
  task.completed = completed;
  return task;
}

function patch(id, fields) {
  const task = getById(id);
  if (!task) return null;
  if (fields.title !== undefined) task.title = fields.title;
  if (fields.course !== undefined) task.course = fields.course;
  if (fields.completed !== undefined) task.completed = fields.completed;
  return task;
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, replace, patch, remove };
