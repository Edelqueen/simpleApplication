const express = require('express');
const { getAsync, setAsync } = require('../redisClient');

const router = express.Router();

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

// Create
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ error: 'Item name is required' });
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
router.get('/', async (req, res) => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send({ error: 'Failed to fetch items' });
  }
});

// Read one
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;