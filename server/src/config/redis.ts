import Redis from "ioredis";
import logger from "../utils/logger";

let redisClient: Redis;

export const connectRedis = async (): Promise<Redis> => {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined in environment variables");
  }

  // Prevent multiple connections in dev/hot reload
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL);

    redisClient.on("connect", () => {
      logger.info("Redis connected");
    });

    redisClient.on("error", (err) => {
      logger.error("Redis connection error:", err);
    });
  }

  return redisClient;
};

export default connectRedis;
