import { redisClient } from "../config/redis.js";

export async function getOrSetCache(key, ttlSeconds, fetchFunction) {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached); 
    }
  } catch (err) {
    console.error("Redis GET failed:", err);
  }

  // Cache miss → fetch data
  const result = await fetchFunction();

  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(result));
  } catch (err) {
    console.error("Redis SET failed:", err);
  }

  return result;
}
