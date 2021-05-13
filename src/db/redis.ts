// redis-client.js
import redis from 'redis';
import { promisify } from 'util';

const redisURL = process.env.REDIS_URL!;
const client = redis.createClient(redisURL);

export default {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client),
};
