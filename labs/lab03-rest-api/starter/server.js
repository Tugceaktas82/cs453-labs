//server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// In-memory data store for the items collection
let items = [
  { id: 1, name: "keyboard", quantity: 10 }
];
let nextId = 2; // Counter to track and assign unique IDs

// 1. GET /health - Return a simple health check response
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

// 2. GET /items - Return all items in the collection
app.get('/items', (req, res) => {
  res.json(items);
});

// 3. GET /items/:id - Return a single item by its ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.json(item);
});

// 4. POST /items - Create a new item
app.post('/items', (req, res) => {
  const { name, quantity } = req.body;

  // Basic validation to ensure required fields are present
  if (!name || quantity === undefined) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }

  const newItem = {
    id: nextId++,
    name: name,
    quantity: parseInt(quantity)
  };

  items.push(newItem);
  res.status(201).json(newItem); // 201 Created status code
});

// 5. PUT /items/:id - Update an existing item
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, quantity } = req.body;

  const item = items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  if (name !== undefined) item.name = name;
  if (quantity !== undefined) item.quantity = parseInt(quantity);

  res.json(item);
});

// 6. DELETE /items/:id - Delete an existing item
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  items.splice(itemIndex, 1);
  res.json({ message: "Item deleted successfully" });
});

// Only start the server if the file is run directly (prevents port conflicts during tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the app instance for automated testing
module.exports = app;