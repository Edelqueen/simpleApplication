require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD
});

client.on('error', (err) => console.error('Redis Client Error', err));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

const ITEMS_KEY = 'items';

// Helper function to get items from Redis
async function getItems() {
  const items = await getAsync(ITEMS_KEY);
  return items ? JSON.parse(items) : [];
}

// Helper function to save items to Redis
async function saveItems(items) {
  await setAsync(ITEMS_KEY, JSON.stringify(items));
}

// Create
app.post('/items', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ error: 'Item name is required' });
  }
  const items = await getItems();
  const item = { id: Date.now(), name, createdAt: new Date(), updatedAt: new Date() };
  items.push(item);
  await saveItems(items);
  res.status(201).send(item);
});

// Read
app.get('/items', async (req, res) => {
  const items = await getItems();
  res.send(items);
});

// Update
app.put('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ error: 'Item name is required' });
  }
  const items = await getItems();
  const item = items.find(item => item.id === id);
  if (!item) {
    return res.status(404).send({ error: 'Item not found' });
  }
  item.name = name;
  item.updatedAt = new Date();
  await saveItems(items);
  res.send(item);
});

// Delete
app.delete('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  let items = await getItems();
  items = items.filter(item => item.id !== id);
  await saveItems(items);
  res.status(204).send();
});

// Serve dynamic content
app.get('/dynamic', async (req, res) => {
  const items = await getItems();
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

const PORT = process.env.PORT || 5012;
app.listen(PORT, async () => {
  await client.connect();
  console.log(`Server running on http://localhost:${PORT}`);
});