const {createClient} = require('redis');

const redis = createClient({url: process.env.REDIS_URL});

redis.on('connect', () => {
  console.log('Connected to Redis server');
});
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});
redis.connect();

export default redis;
