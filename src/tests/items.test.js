// src/tests/items.test.js
const request = require('supertest');
const express = require('express');
const itemsRouter = require('../routes/items');
const { client } = require('../redisClient');

const app = express();
app.use(express.json());
app.use('/items', itemsRouter);

// Test data
const testItem = {
  name: 'Test Product',
  price: 30,
  description: 'Test product description'
};

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

beforeEach(async () => {
  try {
    const keys = await client.keys('test:*');
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Error cleaning test data:', error);
  }
});

describe('Items API', () => {
  it('should be connected to Redis', () => {
    expect(client.isOpen).toBe(true);
  });

  describe('POST /items', () => {
    it('should create a new item', async () => {
      const response = await request(app)
        .post('/items')
        .send(testItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testItem.name);
      expect(Number(response.body.price)).toBe(testItem.price);
      expect(response.body.description).toBe(testItem.description);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidItem = { name: 'Test' }; // Missing price
      const response = await request(app)
        .post('/items')
        .send(invalidItem);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /items', () => {
    it('should get all items', async () => {
      // First create an item
      await request(app)
        .post('/items')
        .send(testItem);

      const response = await request(app)
        .get('/items');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
