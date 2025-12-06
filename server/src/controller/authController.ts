import { asyncHandler } from "../middleware/errorHandler";
import prisma from "../prisma";
import { ApiError } from "../utils/error";
import logger from "../utils/logger";
import { loginSchema, registerUserSchema } from "../utils/validation";
import type { Request, Response, NextFunction } from "express";
import argon2 from "argon2";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Registration endpoint hit...");
      const request = registerUserSchema.parse(req.body);

      if (!request) return next(ApiError.validation("All fields are required"));

      let existingUser = await prisma.user.findUnique({
        where: { email: request.email },
      });
      if (existingUser) {
        logger.warn("User already exists");
        throw ApiError.conflict("User already exists");
      }

      const hash = await argon2.hash(request.password);

      const user = await prisma.user.create({
        data: {
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          password: hash,
        },
      });
      logger.warn("User saved successfully", user.id);

      const accessToken = generateAccessToken(res, user.id, user.role);
      const refreshToken = generateRefreshToken(res, user.id, user.role);

      ///here we send both tokens to frontend
      res.status(201).json({
        success: true,
        message: "User Registered successfully, Welcome!",
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      next(ApiError.internal(`Registration failed: ${error.message}`));
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  try {
    logger.info("Login endpoint hit...");
    const request = loginSchema.parse(req.body);
    if (!request) return next(ApiError.badRequest("All fields are required"));

    const user = await prisma.user.findUnique({
      where: { email: request.email },
    });

    if (!user) return next(ApiError.validation("Invalid email and password"));

    const isPasswordMatch = await argon2.verify(
      user.password,
      request.password
    );

    if (!isPasswordMatch)
      return next(ApiError.validation("Invalid email and password"));

    const accessToken = generateAccessToken(res, user.id, user.role);
    const refreshToken = generateRefreshToken(res, user.id, user.role);

    logger.info("Login successful", user.id);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    next(ApiError.internal(`Login failed: ${error.message}`));
  }
});

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Private
 */
export const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    logger.info("Refresh Token endpoint hit...");
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) return next(ApiError.validation("No refresh token"));

    // const decoded = jwt.verify(
    //   refreshToken,
    //   process.env.REFRESH_TOKEN_SECRET as string
    // ) as MyJwtPayload;

    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as MyJwtPayload & { userId: string; userRole?: string };
    } catch (e) {
      return next(ApiError.unauthorized("Invalid refresh token"));
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) return next(ApiError.notFound("User not found"));

    const newAccessToken = generateAccessToken(res, user.id, user.role);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          role: user.role,
        },
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client should delete token)
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return next(ApiError.notFound("User not found"));
  }

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - startTime;

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "connected",
        responseTime: `${dbResponseTime}ms`,
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error: any) {
    console.error("Health check failed:", error);

    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "disconnected",
        error: error.message,
      },
      environment: process.env.NODE_ENV || "development",
    });
  }
};
