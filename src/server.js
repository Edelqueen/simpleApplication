const express = require('express');
const { client } = require('./redisClient');
const itemsRouter = require('./routes/items');
const testRouter = require('./routes/test');

const app = express();
const PORT = process.env.PORT || 2019;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/items', itemsRouter);
app.use('/test', testRouter);

// Start server after Redis connection
const startServer = async () => {
  try {
    await client.connect();
    console.log('Redis connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
};

module.exports = { startServer };