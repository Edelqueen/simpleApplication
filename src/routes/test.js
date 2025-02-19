const express = require('express');
const { client, setAsync, getAsync } = require('../redisClient');

const router = express.Router();

// Test endpoint
router.get('/ping', (req, res) => {
  res.send('pong');
});

// Redis test endpoint
router.get('/test-redis', async (req, res) => {
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

module.exports = router;