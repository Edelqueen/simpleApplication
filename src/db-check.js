// src/db-check.js
const express = require('express');
const { dbAsync } = require('./sqliteDb');
const router = express.Router();

// SQLite health check endpoint
router.get('/health', async (req, res) => {
  try {
    const result = await dbAsync.get('SELECT sqlite_version() as version');
    res.json({
      status: 'ok',
      database: 'sqlite3',
      version: result.version
    });
  } catch (error) {
    console.error('Database health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Database health check failed',
      error: error.message
    });
  }
});

// Test database operations
router.get('/test', async (req, res) => {
  try {
    // Check if the test table exists
    const tableExists = await dbAsync.get(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='test_table'
    `);

    if (!tableExists) {
      throw new Error('Test table does not exist');
    }

    // Insert a test record
    const testValue = `test-${Date.now()}`;
    await dbAsync.run('INSERT INTO test_table (test_value) VALUES (?)', [testValue]);

    // Retrieve the test record
    const result = await dbAsync.get('SELECT * FROM test_table ORDER BY id DESC LIMIT 1');

    res.json({
      status: 'ok',
      message: 'SQLite database is working properly',
      test_record: result,
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database test failed',
      error: error.message,
    });
  }
});

module.exports = router;