const express = require('express');
const redis = require('redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2019;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Redis Client Setup
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD
});

// Redis Event Listeners
client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Redis Client Connected'));
client.on('ready', () => console.log('Redis Client Ready'));
client.on('end-session', () => console.log('Redis Client Connection session'));

// Promisify Redis commands
const getAsync = client.get.bind(client);
const setAsync = client.set.bind(client);

// Helper functions for items
async function getItems() {
  try {
    const items = await getAsync('items');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting items:', error);
    return [];
  }
}

async function saveItems(items) {
  try {
    await setAsync('items', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items:', error);
    throw error;
  }
}

// Test endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Redis test endpoint
app.get('/test-redis', async (req, res) => {
  console.log('Test-redis test started');
  try {
    if (!client.isReady) {
      console.log('Redis client not ready');
      return res.status(503).send('Redis client not ready');
    }

    await setAsync('test_key', 'test_value');
    const value = await getAsync('test_key');
    console.log('Redis test successful, value:', value);
    res.send(`Redis is reachable. Test key value: ${value}`);
  } catch (err) {
    console.error('Redis connection test failed', err);
    res.status(500).send(`Redis connection test failed: ${err.message}`);
  }
});

// CRUD Endpoints
// Create
app.post('/items', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ error: 'Item name is required' });
    }

    if (!client.isReady) {
      return res.status(503).send({ error: 'Redis connection not ready' });
    }

    const items = await getItems();
    const item = { 
      id: Date.now(), 
      name, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    
    items.push(item);
    await saveItems(items);
    res.status(201).send(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).send({ error: 'Failed to create item' });
  }
});

// Read all
app.get('/items', async (req, res) => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send({ error: 'Failed to fetch items' });
  }
});

// Read one
app.get('/items/:id', async (req, res) => {
  try {
    const items = await getItems();
    const item = items.find(item => item.id === parseInt(req.params.id));
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).send({ error: 'Failed to fetch item' });
  }
});

// Update
app.put('/items/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ error: 'Item name is required' });
    }

    const items = await getItems();
    const index = items.findIndex(item => item.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).send({ error: 'Item not found' });
    }

    items[index] = {
      ...items[index],
      name,
      updatedAt: new Date()
    };

    await saveItems(items);
    res.json(items[index]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send({ error: 'Failed to update item' });
  }
});

// Delete
app.delete('/items/:id', async (req, res) => {
  try {
    const items = await getItems();
    const index = items.findIndex(item => item.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).send({ error: 'Item not found' });
    }

    items.splice(index, 1);
    await saveItems(items);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send({ error: 'Failed to delete item' });
  }
});

// Start server after Redis connection
const startServer = async () => {
  try {
    await client.connect();
    console.log('Redis connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
};

startServer();