require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

let items = [];

// Create
app.post('/items', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ error: 'item name is required' });
  }
  const item = { id: Date.now(), name, createdAt: new Date(), updatedAt: new Date() };
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
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ error: 'item name is required' });
  }
  let item = items.find(item => item.id === id);
  if (!item) {
    return res.status(404).send({ error: 'Item not found' });
  }
  item.name = name;
  item.updatedAt = new Date();
  res.send(item);
});

// Delete
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  items = items.filter(item => item.id !== id);
  res.status(204).send();
});

// Serve dynamic content
app.get('/dynamic', (req, res) => {
  const dynamicContent = `
    <html>
      <head>
        <title>Dynamic Content</title>
      </head>
      <body>
        <h1>Dynamic Items</h1>
        <ul>
          ${items.map(item => `<li>${item.name} (Created at: ${item.createdAt})</li>`).join('')}
        </ul>
      </body>
    </html>
  `;
  res.send(dynamicContent);
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});