const redis = require('redis');

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD
});

// Redis Event Listeners
client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Redis Client Connected'));
client.on('ready', () => console.log('Redis Client Ready'));
client.on('end-session', () => console.log('Redis Client Connection session'));

const getAsync = client.get.bind(client);
const setAsync = client.set.bind(client);

module.exports = { client, getAsync, setAsync };