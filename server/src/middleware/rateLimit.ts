import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import type { RedisReply } from "rate-limit-redis";
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";

const redisClient = new Redis(process.env.REDIS_URL!);

const createLimiter = (options: {
  windowMs: number;
  max: number;
  keyPrefix: string;
}) =>
  rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]): Promise<RedisReply> => {
        return redisClient.call(
          ...(args as [string, ...string[]])
        ) as Promise<RedisReply>;
      },
      prefix: options.keyPrefix || "rl:",
    }),
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },

    // keyGenerator: (req) => {
    //    const ip = rateLimit.ipKeyGenerator(req, res);
    //   return `${ip}-${options.keyPrefix}`;
    // },
  });

export const generalLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 100,
  keyPrefix: "general",
});

export const authLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 5,
  keyPrefix: "auth",
});

// ddos protection rate limiter using Redis as storage
export const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

export const ddosProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await rateLimiter.consume(req.ip as string);
    return next();
  } catch {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Slow down.",
    });
  }
};
