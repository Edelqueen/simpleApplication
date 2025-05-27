// src/routes/items.js
const express = require('express');
const router = express.Router();
const { dbAsync } = require('../sqliteDb');

// Create item
router.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    // Validate required fields
    if (!name || price === undefined) {
      return res.status(400).json({ 
        error: 'Name and price are required fields' 
      });
    }

    // Create new item
    const id = Date.now().toString();
    const item = {
      id,
      name,
      price,
      description: description || ''
    };

    // Store in SQLite DB
    await dbAsync.run(
      'INSERT INTO items (id, name, price, description) VALUES (?, ?, ?, ?)',
      [id, name, price, item.description]
    );
    
    // Return created item
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
    const { name, price, description } = req.body;
    
    // Check if item exists
    const existingItem = await dbAsync.get('SELECT * FROM items WHERE id = ?', [id]);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Update item
    const updatedItem = {
      id,
      name: name || existingItem.name,
      price: price !== undefined ? price : existingItem.price,
      description: description !== undefined ? description : existingItem.description
    };
    
    await dbAsync.run(
      'UPDATE items SET name = ?, price = ?, description = ? WHERE id = ?',
      [updatedItem.name, updatedItem.price, updatedItem.description, id]
    );
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
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