// src/routes/items.js
const express = require('express');
const router = express.Router();
const { dbAsync } = require('../sqliteDb');

// Create item
router.post('/', async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({ error: 'Name, description, and category are required fields' });
    }

    // Create new item
    const id = Date.now().toString();
    const item = {
      id,
      name,
      description,
      category
    };

    // Store in SQLite DB
    await dbAsync.run(
      'INSERT INTO items (id, name, description, category) VALUES (?, ?, ?, ?)',
      [id, name, description, category]
    );

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Error creating item' });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await dbAsync.all('SELECT * FROM items');
    res.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ error: 'Error retrieving items' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await dbAsync.get('SELECT * FROM items WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({ error: 'Error retrieving item' });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    // Check if item exists
    const existingItem = await dbAsync.get('SELECT * FROM items WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update item
    const updatedItem = {
      id,
      name: name || existingItem.name,
      description: description || existingItem.description,
      category: category || existingItem.category
    };

    await dbAsync.run(
      'UPDATE items SET name = ?, description = ?, category = ? WHERE id = ?',
      [updatedItem.name, updatedItem.description, updatedItem.category, id]
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error); // Log the error details
    res.status(500).json({ error: 'Error updating item' });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if item exists
    const existingItem = await dbAsync.get('SELECT * FROM items WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Delete item
    await dbAsync.run('DELETE FROM items WHERE id = ?', [id]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;