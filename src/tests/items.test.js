// src/tests/items.test.js
const request = require('supertest');
const express = require('express');
const itemsRouter = require('../routes/items');
const { dbAsync } = require('../sqliteDb');

const app = express();
app.use(express.json());
app.use('/items', itemsRouter);

// Test data
const testItem = {
  name: 'Test Product',
  description: 'Test product description',
  category: 'Test Category' // Include the new column
};

beforeAll(async () => {
  try {
    // Ensure SQLite database is initialized before tests
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Items table created successfully');
  } catch (error) {
    console.error('Error initializing items table:', error);
  }
});

afterAll(async () => {
  // Clean up test table after tests
  await dbAsync.run('DROP TABLE IF EXISTS items');
});

beforeEach(async () => {
  // Clear all items from the test table before each test
  await dbAsync.run('DELETE FROM items');
});

describe('Items API', () => {
  describe('POST /items', () => {
    it('should create a new item', async () => {
      const response = await request(app)
        .post('/items')
        .send(testItem);

      console.log('POST /items response:', response.body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testItem.name);
      expect(response.body.description).toBe(testItem.description);
      expect(response.body.category).toBe(testItem.category); // Test the new column
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidItem = { name: 'Test' }; // Missing description and category
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

      console.log('GET /items response:', response.body);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('category', testItem.category); // Test the new column
    });
  });

  describe('GET /items/:id', () => {
    it('should get an item by ID', async () => {
      // First create an item
      const createResponse = await request(app)
        .post('/items')
        .send(testItem);

      const itemId = createResponse.body.id;

      const response = await request(app)
        .get(`/items/${itemId}`);

      console.log('GET /items/:id response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', itemId);
      expect(response.body.name).toBe(testItem.name);
      expect(response.body.category).toBe(testItem.category); // Test the new column
    });

    it('should return 404 if item is not found', async () => {
      const response = await request(app)
        .get('/items/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });
  });

  describe('PUT /items/:id', () => {
    it('should update an existing item', async () => {
      // First create an item
      const createResponse = await request(app)
        .post('/items')
        .send(testItem);

      const itemId = createResponse.body.id;

      const updatedItem = { name: 'Updated Product', category: 'Updated Category' };

      const response = await request(app)
        .put(`/items/${itemId}`)
        .send(updatedItem);

      console.log('PUT /items/:id response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', itemId);
      expect(response.body.name).toBe(updatedItem.name);
      expect(response.body.category).toBe(updatedItem.category); // Test the updated column
    });

    it('should return 404 if item is not found', async () => {
      const updatedItem = { name: 'Updated Product', category: 'Updated Category' };

      const response = await request(app)
        .put('/items/nonexistent-id')
        .send(updatedItem);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });
  });

  describe('DELETE /items/:id', () => {
    it('should delete an existing item', async () => {
      // First create an item
      const createResponse = await request(app)
        .post('/items')
        .send(testItem);

      const itemId = createResponse.body.id;

      const response = await request(app)
        .delete(`/items/${itemId}`);

      console.log('DELETE /items/:id response:', response.body);

      expect(response.status).toBe(204);

      // Verify the item is deleted
      const getResponse = await request(app)
        .get(`/items/${itemId}`);

      console.log('GET /items/:id after delete response:', getResponse.body);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 if item is not found', async () => {
      const response = await request(app)
        .delete('/items/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });
  });
});
