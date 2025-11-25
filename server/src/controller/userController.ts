import logger from "../utils/logger";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import prisma from "../prisma";
import { ApiError } from "../utils/error";
import { editUser } from "../utils/validation";

export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Profile endpoint hit");

    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      return next(ApiError.notFound("User not found"));
    }
    return res.status(200).json({ user });
  }
);

export const editProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Edit profile endpoint hit");
    const request = editUser.parse(req.body);

    const { firstName, lastName, email } = request;
    const userId = req.user!.id;

    //check to see if the user belongs to another
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      return next(ApiError.badRequest("Email already in use"));
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }
);

export const getPublicInstructorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Public profile endpoint hit");

    const instructorId = req.params.id;

    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!instructor) {
      return next(ApiError.notFound("Instructor not found"));
    }

    return res.status(200).json({
      success: true,
      data: instructor,
    });
  }
);
