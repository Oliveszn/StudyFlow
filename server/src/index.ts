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
import { healthCheck } from "./controller/authController";

const app: Express = express();
const PORT = process.env.PORT;

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

app.use("/api/auth", authRoutes);
app.get("/", healthCheck);
app.use(errorHandler);

// Initialize connections and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`live on ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
