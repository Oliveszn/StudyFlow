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
          ...(args as [string, ...string[]]),
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

    keyGenerator: (req) => {
      return `${req.ip}-${options.keyPrefix}`;
    },
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

export const paymentLimiter = createLimiter({
  windowMs: 1 * 60 * 1000,
  max: 3,
  keyPrefix: "payment",
});

// ddos protection rate limiter using Redis as storage
export const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 20,
  duration: 1,
});

export const ddosProtection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const key = req.user?.id || req.ip;
    await rateLimiter.consume(key as string);
    return next();
  } catch {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Slow down.",
    });
  }
};
