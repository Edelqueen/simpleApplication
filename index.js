require('dotenv').config();
const { startServer } = require('./src/server');

startServer();

const express = require('express');
const path = require('path');
const itemsRouter = require('./src/routes/items');
const dbCheckRouter = require('./src/db-check');

// Simple metrics collection
let requestCount = 0;
let requestDuration = [];
const startTime = Date.now();

const app = express();

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  requestCount++;

  res.on('finish', () => {
    const duration = Date.now() - start;
    requestDuration.push(duration);

    // Keep only last 1000 requests for memory efficiency
    if (requestDuration.length > 1000) {
      requestDuration = requestDuration.slice(-1000);
    }
  });

  next();
});

app.use(express.json());
app.use(express.static('public'));

app.use('/items', itemsRouter);
app.use('/db', dbCheckRouter);

// Prometheus metrics endpoint
app.get('/metrics', (req, res) => {
  const uptime = Date.now() - startTime;
  const avgDuration = requestDuration.length > 0 
    ? requestDuration.reduce((a, b) => a + b, 0) / requestDuration.length 
    : 0;

  const metrics = `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${requestCount}

# HELP http_request_duration_ms Average HTTP request duration in milliseconds
# TYPE http_request_duration_ms gauge
http_request_duration_ms ${avgDuration}

# HELP app_uptime_seconds Application uptime in seconds
# TYPE app_uptime_seconds gauge
app_uptime_seconds ${Math.floor(uptime / 1000)}

# HELP nodejs_version_info Node.js version information
# TYPE nodejs_version_info gauge
nodejs_version_info{version="${process.version}"} 1
`;

  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});