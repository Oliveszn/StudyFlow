import { asyncHandler } from "../middleware/errorHandler";
import redisService from "../config/redis";
import { Request, Response } from "express";
import prisma from "../prisma";
import { ApiError } from "../utils/error";
import logger from "../utils/logger";

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Fetching public categories");

    const cacheKey = "categories:all";
    const cachedData = await redisService.get(cacheKey);

    logger.info("Categories served from cache");

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

    ////Send response with courses count
    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      courseCount: cat._count.courses,
    }));

    logger.info("Categories fetched from database", {
      count: formattedCategories.length,
    });

    const response = {
      success: true,
      data: formattedCategories,
    };

    await redisService.set(cacheKey, JSON.stringify(response), 3600); //1hr

    res.status(200).json(response);
  }
);

/**
 * @route   GET /api/categories/:slug
 * @desc    Get category by slug with details
 * @access  Public
 */
export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    logger.info("Fetching category by slug", { slug });

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
      logger.warn("Category not found", { slug });
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

    await redisService.set(cacheKey, JSON.stringify(response), 3600); ///1hr

    res.status(200).json(response);
  }
);

/**
 * @route   GET /api/categories/:slug/courses
 * @desc    Get courses in a category
 * @access  Public
 */
export const getCoursesByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { page = 1, limit = 12, sort = "popular" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    logger.info("Fetching courses by category", {
      slug,
      page,
      limit,
      sort,
    });

    const category = await prisma.category.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!category) {
      logger.warn("Attempted access to missing category", { slug });
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
    logger.info("Courses fetched for category", {
      slug,
      total,
    });

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

    await redisService.set(cacheKey, JSON.stringify(response), 900); //15mins

    res.status(200).json(response);
  }
);
