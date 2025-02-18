require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

let items = [];

// Create
app.post('/items', (req, res) => {
  const item = req.body;
  items.push(item);
  res.status(201).send(item);
});

// Read
app.get('/items', (req, res) => {
  res.send(items);
});

// Update
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedItem = req.body;
  items = items.map(item => (item.id === id ? updatedItem : item));
  res.send(updatedItem);
});

// Delete
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  items = items.filter(item => item.id !== id);
  res.status(204).send();
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});