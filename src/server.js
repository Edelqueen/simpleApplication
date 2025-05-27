const express = require('express');
const { db } = require('./sqliteDb');
const itemsRouter = require('./routes/items');
const dbCheckRouter = require('./db-check');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2019;

// Ensure data directory exists
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/items', itemsRouter);
app.use('/db', dbCheckRouter);

// Root health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'simple-application' });
});

// Start server with SQLite DB
const startServer = async () => {
  try {
    // SQLite is already initialized in sqliteDb.js
    console.log('SQLite database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

module.exports = { startServer };