import logger from "../utils/logger";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import prisma from "../prisma";
import { ApiError } from "../utils/error";
import { editUser } from "../utils/validation";
import argon2 from "argon2";

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /users/profile hit", { userId: req.user?.id });

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
      logger.warn("User profile not found", { userId: req.user?.id });
      return next(ApiError.notFound("User not found"));
    }
    logger.info("User profile fetched successfully", { userId: user.id });
    return res.status(200).json({ user });
  }
);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
export const editProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    logger.info("PUT /users/edit hit", { userId });
    const request = editUser.parse(req.body);

    const { firstName, lastName, email } = request;

    logger.debug("Edit profile payload", {
      userId,
      firstName,
      lastName,
      email,
    });

    //check to see if the email belongs to another
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      logger.warn("Email already in use", { email, userId });
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

    logger.info("User profile updated successfully", { userId });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }
);

/**
 * @route   GET /api/users/:id/profile
 * @desc    Get public instructor profile
 * @access  Public
 */
export const getPublicInstructorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const instructorId = req.params.id;
    logger.info("GET /users/public-profile hit", { instructorId });

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
      logger.warn("Public instructor not found", { instructorId });
      return next(ApiError.notFound("Instructor not found"));
    }

    logger.info("Public instructor profile fetched", { instructorId });
    return res.status(200).json({
      success: true,
      data: instructor,
    });
  }
);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    logger.info("DELETE /users/delete hit", { userId });

    ////check if user is an instructor with courses
    const courseCount = await prisma.course.count({
      where: { instructorId: userId },
    });

    if (courseCount > 0) {
      logger.warn("User attempted delete with active courses", {
        userId,
        courseCount,
      });

      throw ApiError.badRequest(
        "Cannot delete account with active courses. Please delete or transfer your courses first."
      );
    }

    // Soft delete - deactivate account
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    logger.info("User account soft-deleted", { userId });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  }
);

/**
 * @route   PATCH /api/auth/change-password
 * @desc    Change password (when logged in)
 * @access  Private
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    logger.info("PATCH /users/change-password hit", { userId });
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      logger.warn("User not found during password change", { userId });
      throw ApiError.notFound("User not found");
    }

    // const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    const isPasswordValid = await argon2.verify(user.password, currentPassword);

    if (!isPasswordValid) {
      logger.warn("Invalid current password attempt", { userId });
      throw ApiError.unauthorized("Current password is incorrect");
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 12);
    const hashedPassword = await argon2.hash(newPassword);
    ////update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    logger.info("Password changed successfully", { userId });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);
