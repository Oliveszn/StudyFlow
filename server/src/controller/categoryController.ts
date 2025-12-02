import { asyncHandler } from "../middleware/errorHandler";
import redisService from "../config/redis";
import { Request, Response } from "express";
import prisma from "../prisma";
import { ApiError } from "../utils/error";

///GET CATEGORY
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const cacheKey = "categories:all";
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            courses: {
              where: { isPublished: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Format response with course count
    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      courseCount: cat._count.courses,
    }));

    const response = {
      success: true,
      data: formattedCategories,
    };

    await redisService.set(cacheKey, JSON.stringify(response), 3600);

    res.status(200).json(response);
  }
);

///GET A SINGLE CATEGORY
export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    // Check cache
    const cacheKey = `category:${slug}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            courses: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    const response = {
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        courseCount: category._count.courses,
      },
    };

    // Cache for 1 hour
    await redisService.set(cacheKey, JSON.stringify(response), 3600);

    res.status(200).json(response);
  }
);

/////GET COURSES INSIDE CATEGORY
export const getCoursesByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { page = 1, limit = 12, sort = "popular" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Find category
    const category = await prisma.category.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    // Determine sort order
    let orderBy: any = {};
    switch (sort) {
      case "popular":
        orderBy = { enrollmentCount: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { averageRating: "desc" };
        break;
      default:
        orderBy = { enrollmentCount: "desc" };
    }

    // Check cache
    const cacheKey = `category:${slug}:courses:${page}:${limit}:${sort}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: {
          categoryId: category.id,
          isPublished: true,
        },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.course.count({
        where: {
          categoryId: category.id,
          isPublished: true,
        },
      }),
    ]);

    const response = {
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug,
        },
        courses,
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };

    // Cache for 15 minutes
    await redisService.set(cacheKey, JSON.stringify(response), 900);

    res.status(200).json(response);
  }
);
