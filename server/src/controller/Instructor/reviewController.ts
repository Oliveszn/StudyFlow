import { asyncHandler } from "../../middleware/errorHandler";
import { Request, Response } from "express";
import prisma from "../../prisma";
import { ApiError } from "../../utils/error";

export const getCourseReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user!.id;
    const { page = 1, limit = 10, rating } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Verify course belongs to instructor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId,
      },
    });

    if (!course) {
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    // Build where clause
    const where: any = { courseId };
    if (rating) {
      where.rating = Number(rating);
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.review.count({ where }),
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

export const getReviewStats = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user!.id;

    // Verify course belongs to instructor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId,
      },
    });

    if (!course) {
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: { courseId },
      _count: { rating: true },
    });

    // Format distribution
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingDistribution.forEach((item) => {
      distribution[item.rating as keyof typeof distribution] =
        item._count.rating;
    });

    // Calculate percentages
    const total = Object.values(distribution).reduce(
      (sum, count) => sum + count,
      0
    );
    const percentages = Object.entries(distribution).reduce(
      (acc, [rating, count]) => {
        acc[rating as keyof typeof acc] =
          total > 0 ? Math.round((count / total) * 100) : 0;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get average rating
    const stats = await prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.status(200).json({
      success: true,
      data: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating,
        distribution,
        percentages,
      },
    });
  }
);
