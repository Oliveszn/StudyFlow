import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import { connectDB } from "./prisma";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { healthCheck } from "./controller/authController";
import Redis from "ioredis";
import connectRedis from "./config/redis";
import { ddosProtection, generalLimiter } from "./middleware/rateLimit";

const app: Express = express();
const PORT = process.env.PORT;
let redisClient: Redis;
app.use(helmet());
app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL as string, "http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(ddosProtection);

app.use("/api", generalLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.get("/", healthCheck);
app.use(errorHandler);

//start server
const startServer = async () => {
  try {
    await connectDB();
    redisClient = await connectRedis();

    app.listen(PORT, () => {
      logger.info(`live on ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
