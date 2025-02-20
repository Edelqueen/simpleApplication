// src/routes/test.js
const express = require('express');
const { client } = require('../redisClient');

const router = express.Router();

// Ping endpoint
router.get('/ping', (req, res) => {
  res.send('pong');
});

// Redis test endpoint
router.get('/test-redis', async (req, res) => {
  try {
    if (!client.isReady) {
      return res.status(503).send('Redis client not ready');
    }

    await client.set('test_key', 'test_value');
    const value = await client.get('test_key');
    res.send(`Redis is reachable. Test value: ${value}`);
  } catch (error) {
    console.error('Redis test error:', error);
    res.status(500).send('Redis connection test failed');
  }
});

module.exports = router;
