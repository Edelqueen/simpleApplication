// src/routes/items.js
const express = require('express');
const router = express.Router();
const { client } = require('../redisClient');

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
      price: price.toString(), // Convert to string for Redis storage
      description: description || ''
    };

    // Store in Redis
    await client.hSet(`test:item:${id}`, item);
    
    // Return created item with price converted back to number
    res.status(201).json({
      ...item,
      price: Number(item.price)
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Error creating item' });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const keys = await client.keys('test:item:*');
    const items = await Promise.all(
      keys.map(async (key) => {
        const item = await client.hGetAll(key);
        return {
          ...item,
          price: Number(item.price) // Convert price back to number
        };
      })
    );
    res.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ error: 'Error retrieving items' });
  }
});

module.exports = router;
