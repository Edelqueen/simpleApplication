const request = require('supertest');
const express = require('express');
const dbCheckRouter = require('../db-check');
const { db, dbAsync } = require('../sqliteDb'); // Import `db`

const app = express();
app.use('/db', dbCheckRouter);

describe('SQLite3 Database Endpoints', () => {
  beforeAll(async () => {
    // Ensure SQLite database is initialized before tests
    await dbAsync.run(`
      CREATE TABLE IF NOT EXISTS test_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  afterAll(async () => {
    // Clean up test table after tests
    await dbAsync.run('DROP TABLE IF EXISTS test_table');
    db.close(); // Properly close the database connection
  });

  describe('GET /db/health', () => {
    it('should return SQLite database health status', async () => {
      const response = await request(app).get('/db/health').expect(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('database', 'sqlite3');
    });
  });

  describe('GET /db/test', () => {
    it('should perform database operations successfully', async () => {
      const response = await request(app).get('/db/test').expect(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('test_record');
      expect(response.body.test_record).toHaveProperty('test_value');
    });

    it('should handle database errors gracefully', async () => {
      // Simulate a database error by dropping the test table
      await dbAsync.run('DROP TABLE IF EXISTS test_table');
      const response = await request(app).get('/db/test').expect(500);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Database test failed');
    });
  });
});