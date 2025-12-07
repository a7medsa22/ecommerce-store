const {createClient} = require('redis');

const redis = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.log('Redis: Max retries reached, giving up.');
                return new Error('Max retries reached');
            }
            return Math.min(retries * 50, 1000);
        }
    }
});

redis.on('connect', () => {
  console.log('Connected to Redis server');
});
redis.on('error', (err) => {
  // console.error('Redis connection error:', err);
});
redis.connect().catch(err => {
    console.log('Failed to connect to Redis, caching will be disabled.');
});

module.exports = redis;
