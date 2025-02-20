// src/tests/test.test.js
const request = require('supertest');
const express = require('express');
const testRouter = require('../routes/redis-check');
const { client } = require('../redisClient');

const app = express();
app.use('/', testRouter);

// Setup and teardown
beforeAll(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis Cloud for testing');
  } catch (error) {
    console.error('Error connecting to Redis Cloud:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await client.quit();
    console.log('Disconnected from Redis Cloud');
  } catch (error) {
    console.error('Error disconnecting from Redis:', error);
  }
});

describe('Test Endpoints', () => {
  // Test ping endpoint
  describe('GET /ping', () => {
    it('should return pong', async () => {
      const response = await request(app)
        .get('/ping')
        .expect(200);

      expect(response.text).toBe('pong');
    });
  });

  // Test Redis connection
  describe('GET /test-redis', () => {
    it('should successfully test Redis connection', async () => {
      const response = await request(app)
        .get('/test-redis')
        .expect(200);

      expect(response.text).toContain('Redis is reachable');
    });
  });
});
