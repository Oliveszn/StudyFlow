import logger from "../utils/logger";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import prisma from "../prisma";
import { ApiError } from "../utils/error";
import { editUser } from "../utils/validation";
import argon2 from "argon2";

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get user profile
 * @access  Private
 */
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

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
export const editProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Edit profile endpoint hit");
    const request = editUser.parse(req.body);

    const { firstName, lastName, email } = request;
    const userId = req.user!.id;

    //check to see if the email belongs to another
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

/**
 * @route   GET /api/v1/users/:id/profile
 * @desc    Get public instructor profile
 * @access  Public
 */
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
        _count: {
          select: {
            coursesCreated: {
              where: { isPublished: true },
            },
          },
        },
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

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    ////check if user is an instructor with courses
    const courseCount = await prisma.course.count({
      where: { instructorId: userId },
    });

    if (courseCount > 0) {
      throw ApiError.badRequest(
        "Cannot delete account with active courses. Please delete or transfer your courses first."
      );
    }

    // Soft delete - deactivate account
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  }
);

/**
 * @route   PATCH /api/v1/auth/change-password
 * @desc    Change password (when logged in)
 * @access  Private
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    const isPasswordValid = await argon2.verify(user.password, currentPassword);

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Current password is incorrect");
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 12);
    const hashedPassword = await argon2.hash(newPassword);
    ////update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);
