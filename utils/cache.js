import { redis } from '../config/redis.js';

export async function clearCacheByModel(modelName) {
    const pattern = `${modelName}:all:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(keys);
        console.log(`🗑️  Cleared cache for : ${modelName}: ${keys.length} keys deleted`);
    }
}