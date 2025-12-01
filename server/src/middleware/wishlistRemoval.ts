////this is the middleware to remove a course from wishlist on enrollment
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { asyncHandler } from "./errorHandler";

export const removeFromWishlistOnEnrollment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { courseId } = req.body;

    if (userId && courseId) {
      ///Remove from wishlist if the course is pressent
      await prisma.wishlist.deleteMany({
        where: {
          userId,
          courseId,
        },
      });
    }

    next();
  }
);
