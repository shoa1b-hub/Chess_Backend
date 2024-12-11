import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,        
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (error) {
    console.error('Failed to connect:', error);
  }
};

export const redis = redisClient;