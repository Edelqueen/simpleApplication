// src/routes/test.js
const express = require('express');
const { client } = require('../redisclient');

const router = express.Router();

// Ping endpoint
router.get('/ping', (req, res) => {
  res.send('pong');
});

// Database test endpoint
router.get('/test-redis', async (req, res) => {
  try {
    // Connect to Redis if not already connected
    if (!client.isReady) {
      await client.connect();
    }

    await client.set('test_key', 'test_value');
    const value = await client.get('test_key');
    res.send(`Database is working. Test value: ${value}`);
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).send('Database connection test failed');
  }
});

module.exports = router;