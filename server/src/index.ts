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

import publicCourseRoutes from "./routes/courseRoutes";
import publicCategoryRoutes from "./routes/categoryRoutes";
import publicSearchRoutes from "./routes/searchRoutes";
import paymentRoutes from "./routes/paymentRoutes";

import instructorCourseRoutes from "./routes/instructor/courseRoutes";
import instructorSectionRoutes from "./routes/instructor/sectionRoutes";
import instructorLessonRoutes from "./routes/instructor/lessonRoutes";
import instructorReviewRoutes from "./routes/instructor/reviewRoutes";

import studentEnrollmentRoutes from "./routes/student/enrollmentRoute";
import studentReviewRoutes from "./routes/student/reviewRoutes";
import studentWishlistRoutes from "./routes/student/wishListRoutes";
import studentProgressRoutes from "./routes/student/progressRoute";

import adminCategoryRoutes from "./routes/admin/categoryRoutes";

import { healthCheck } from "./controller/authController";
import Redis from "ioredis";
// import connectRedis from "./config/redis";
import { ddosProtection, generalLimiter } from "./middleware/rateLimit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app: Express = express();
const PORT = process.env.PORT;
// let redisClient: Redis;
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", generalLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", publicCourseRoutes);
app.use("/api/categories", publicCategoryRoutes);
app.use("/api/search", publicSearchRoutes);
app.use("/api/instructor/courses", instructorCourseRoutes);
app.use("/api/instructor", instructorSectionRoutes);
app.use("/api/instructor", instructorLessonRoutes);
app.use("/api/instructor", instructorReviewRoutes);
app.use("/api/student", studentEnrollmentRoutes);
app.use("/api/student", studentReviewRoutes);
app.use("/api/student", studentWishlistRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/payments", paymentRoutes);
app.get("/", healthCheck);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use(errorHandler);

//start server
const startServer = async () => {
  try {
    await connectDB();
    // redisClient = await connectRedis();

    app.listen(PORT, () => {
      logger.info(`live on ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
