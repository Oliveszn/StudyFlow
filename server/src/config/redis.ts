import Redis from "ioredis";
import logger from "../utils/logger";

let redisClient: Redis | null = null;
let isRedisEnabled = false;

export const connectRedis = (): void => {
  if (!process.env.REDIS_URL) {
    logger.warn("REDIS_URL is not defined - Redis disabled");
    return;
  }
  try {
    redisClient = new Redis(process.env.REDIS_URL);
    isRedisEnabled = true;

    redisClient.on("connect", () => {
      logger.info("Redis connected");
    });

    redisClient.on("error", (err) => {
      logger.error("Redis connection error:", err);
      isRedisEnabled = false;
    });
  } catch (error) {
    logger.error("Failed to initialize Redis:", error);
    isRedisEnabled = false;
  }
};

export const getRedis = async (key: string): Promise<string | null> => {
  if (!isRedisEnabled || !redisClient) {
    logger.warn("Redis not available - get operation skipped");
    return null;
  }

  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error("Redis get error:", error);
    return null;
  }
};

export const setRedis = async (
  key: string,
  value: string,
  ttl?: number
): Promise<boolean> => {
  if (!isRedisEnabled || !redisClient) {
    logger.warn("Redis not available - set operation skipped");
    return false;
  }

  try {
    if (ttl) {
      await redisClient.setex(key, ttl, value);
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (error) {
    logger.error("Redis set error:", error);
    return false;
  }
};

export const deleteRedis = async (key: string): Promise<boolean> => {
  if (!isRedisEnabled || !redisClient) {
    logger.warn("Redis not available - delete operation skipped");
    return false;
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error("Redis delete error:", error);
    return false;
  }
};

export const deleteRedisPattern = async (pattern: string): Promise<boolean> => {
  if (!isRedisEnabled || !redisClient) {
    logger.warn("Redis not available - pattern delete skipped");
    return false;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
      logger.info(`Deleted ${keys.length} keys matching pattern: ${pattern}`);
    }
    return true;
  } catch (error) {
    logger.error("Redis pattern delete error:", error);
    return false;
  }
};

export const existsRedis = async (key: string): Promise<boolean> => {
  if (!isRedisEnabled || !redisClient) return false;
  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    logger.error("Redis exists error:", error);
    return false;
  }
};

export const expireRedis = async (
  key: string,
  ttl: number
): Promise<boolean> => {
  if (!isRedisEnabled || !redisClient) return false;
  try {
    await redisClient.expire(key, ttl);
    return true;
  } catch (error) {
    logger.error("Redis expire error:", error);
    return false;
  }
};

export const isRedisConnected = (): boolean => {
  return isRedisEnabled && redisClient?.status === "ready";
};

connectRedis();

export default {
  get: getRedis,
  set: setRedis,
  del: deleteRedis,
  delPattern: deleteRedisPattern,
  exists: existsRedis,
  expire: expireRedis,
  isConnected: isRedisConnected,
  initialize: connectRedis,
};
