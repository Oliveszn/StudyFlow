import { asyncHandler } from "../../middleware/errorHandler";
import { Request, Response } from "express";
import prisma from "../../prisma";
import { ApiError } from "../../utils/error";
import redisService from "../../config/redis";
import { createReviewSchema, updateReviewSchema } from "../../utils/validation";

async function updateCourseRating(courseId: string) {
  // Calculate new average rating and count
  const stats = await prisma.review.aggregate({
    where: { courseId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  // Update course
  await prisma.course.update({
    where: { id: courseId },
    data: {
      averageRating: stats._avg.rating || null,
      reviewCount: stats._count.rating,
    },
  });
}

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user!.id;
    const request = createReviewSchema.parse(req.body);

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, slug: true, isPublished: true },
    });

    if (!course || !course.isPublished) {
      throw ApiError.notFound("Course not found");
    }

    // Verify user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw ApiError.forbidden(
        "You must be enrolled in this course to leave a review"
      );
    }

    // Check if user already reviewed this course
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingReview) {
      throw ApiError.badRequest(
        "You have already reviewed this course. Use update to modify your review."
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        courseId,
        rating: request.rating,
        comment: request.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update course rating statistics
    await updateCourseRating(courseId);

    // Clear course cache
    await redisService.del(`course:${course.slug}`);
    await redisService.del(`course:${course.slug}:reviews`);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  }
);

export const getMyReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.review.count({ where: { userId } }),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

export const getMyReviewForCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user!.id;

    const review = await prisma.review.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "You have not reviewed this course yet",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  }
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const request = updateReviewSchema.parse(req.body);

    // Verify review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        course: {
          select: { slug: true },
        },
      },
    });

    if (!existingReview) {
      throw ApiError.notFound(
        "Review not found or you do not have permission to update it"
      );
    }

    // Update review
    const review = await prisma.review.update({
      where: { id },
      data: {
        rating: request.rating,
        comment: request.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update course rating statistics
    await updateCourseRating(existingReview.courseId);

    // Clear course cache
    await redisService.del(`course:${existingReview.course.slug}`);
    await redisService.del(`course:${existingReview.course.slug}:reviews`);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verify review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        course: {
          select: { slug: true },
        },
      },
    });

    if (!review) {
      throw ApiError.notFound(
        "Review not found or you do not have permission to delete it"
      );
    }

    // Delete review
    await prisma.review.delete({ where: { id } });

    // Update course rating statistics
    await updateCourseRating(review.courseId);

    // Clear course cache
    await redisService.del(`course:${review.course.slug}`);
    await redisService.del(`course:${review.course.slug}:reviews`);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  }
);
