import { asyncHandler } from "../../middleware/errorHandler";
import { Request, Response } from "express";
import prisma from "../../prisma";
import { ApiError } from "../../utils/error";
import redisService from "../../config/redis";

////GET USERS WISHLIST
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { page = 1, limit = 12 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const [wishlistItems, total] = await Promise.all([
    prisma.wishlist.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            subtitle: true,
            thumbnail: true,
            price: true,
            discountPrice: true,
            currency: true,
            averageRating: true,
            reviewCount: true,
            enrollmentCount: true,
            duration: true,
            isPublished: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { id: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.wishlist.count({ where: { userId } }),
  ]);

  ////filtering unpublished courses
  const publishedWishlist = wishlistItems.filter(
    (item) => item.course.isPublished
  );

  res.status(200).json({
    success: true,
    data: publishedWishlist,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

///ADD A COURSE TO YOUR WISHLIST
export const addToWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { courseId } = req.body;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
      },
    });

    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    if (!course.isPublished) {
      throw ApiError.badRequest("This course is not available");
    }

    // Check if user is already enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (enrollment) {
      throw ApiError.badRequest("You are already enrolled in this course");
    }

    // Check if already in wishlist
    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingWishlist) {
      throw ApiError.badRequest("Course is already in your wishlist");
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            price: true,
            discountPrice: true,
            currency: true,
            averageRating: true,
            reviewCount: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Course added to wishlist",
      data: wishlistItem,
    });
  }
);

///REMOVE CPOURSE FROM YOUR WISHLIST
export const removeFromWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { courseId } = req.params;

    // Check if item exists in wishlist
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!wishlistItem) {
      throw ApiError.notFound("Course not found in wishlist");
    }

    // Remove from wishlist
    await prisma.wishlist.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Course removed from wishlist",
    });
  }
);

///CHECK IF COURSE IS IN WISHLIST
export const checkInWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { courseId } = req.params;

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        inWishlist: !!wishlistItem,
        wishlistId: wishlistItem?.id || null,
      },
    });
  }
);

///CLEAR ENTIRE WISHLIST
export const clearWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Delete all wishlist items for user
    const result = await prisma.wishlist.deleteMany({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: {
        deletedCount: result.count,
      },
    });
  }
);
