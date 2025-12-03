import { Prisma } from "@prisma/client";
import { asyncHandler } from "../middleware/errorHandler";
import { Request, Response } from "express";
import redisService from "../config/redis";
import prisma from "../prisma";

///SEARCH INSTRUCTORS AND COURSES
export const globalSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      q,
      page = 1,
      limit = 12,
      categoryId,
      minPrice,
      maxPrice,
      rating,
      level,
    } = req.query;

    const query = (q as string).trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Build course search where clause
    const courseWhere: Prisma.CourseWhereInput = {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { subtitle: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };

    // Apply filters
    if (categoryId) {
      courseWhere.categoryId = categoryId as string;
    }

    if (minPrice || maxPrice) {
      courseWhere.price = {};
      if (minPrice) courseWhere.price.gte = Number(minPrice);
      if (maxPrice) courseWhere.price.lte = Number(maxPrice);
    }

    if (rating) {
      courseWhere.averageRating = { gte: Number(rating) };
    }

    // Build instructor search where clause
    const instructorWhere: Prisma.UserWhereInput = {
      role: "INSTRUCTOR",
      OR: [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        {
          firstName: {
            contains: query.split(" ")[0],
            mode: "insensitive",
          },
        },
      ],
    };

    const cacheKey = `search:global:${JSON.stringify(req.query)}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Execute searches in parallel
    const [courses, instructors, totalCourses] = await Promise.all([
      prisma.course.findMany({
        where: courseWhere,
        include: {
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
        orderBy: [{ enrollmentCount: "desc" }, { averageRating: "desc" }],
        skip,
        take: Number(limit),
      }),
      prisma.user.findMany({
        where: instructorWhere,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          // bio: true,
          // avatar: true,
          _count: {
            select: {
              coursesCreated: {
                where: { isPublished: true },
              },
            },
          },
        },
        take: 5, /////Instructors are limited here
      }),
      prisma.course.count({ where: courseWhere }),
    ]);

    const response = {
      success: true,
      query,
      data: {
        courses,
        instructors,
        totalCourses,
        totalInstructors: instructors.length,
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCourses,
        pages: Math.ceil(totalCourses / Number(limit)),
      },
    };

    await redisService.set(cacheKey, JSON.stringify(response), 600);

    res.status(200).json(response);
  }
);

///SEARCH COURSES ONLY
export const searchCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      q,
      page = 1,
      limit = 12,
      categoryId,
      minPrice,
      maxPrice,
      rating,
      language,
      sort = "relevance",
    } = req.query;

    const query = (q as string).trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: Prisma.CourseWhereInput = {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { subtitle: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };

    // Apply filters
    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (rating) {
      where.averageRating = { gte: Number(rating) };
    }

    if (language) {
      where.language = language as string;
    }

    // Determine sort order
    let orderBy: Prisma.CourseOrderByWithRelationInput[] = [];

    switch (sort) {
      case "popular":
        orderBy = [{ enrollmentCount: "desc" }];
        break;
      case "newest":
        orderBy = [{ createdAt: "desc" }];
        break;
      case "price-low":
        orderBy = [{ price: "asc" }];
        break;
      case "price-high":
        orderBy = [{ price: "desc" }];
        break;
      case "rating":
        orderBy = [{ averageRating: "desc" }];
        break;
      case "relevance":
      default:
        // Best match first: enrollment count + rating
        orderBy = [{ enrollmentCount: "desc" }, { averageRating: "desc" }];
    }

    const cacheKey = `search:courses:${JSON.stringify(req.query)}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
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
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.course.count({ where }),
    ]);

    const response = {
      success: true,
      query,
      data: courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };

    await redisService.set(cacheKey, JSON.stringify(response), 600); //10 mins

    res.status(200).json(response);
  }
);

///SEARCH INSTRUCTORS
export const searchInstructors = asyncHandler(
  async (req: Request, res: Response) => {
    const { q, page = 1, limit = 12 } = req.query;

    const query = (q as string).trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.UserWhereInput = {
      role: "INSTRUCTOR",
      isActive: true,
      OR: [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        //   { bio: { contains: query, mode: 'insensitive' } }
      ],
    };

    const cacheKey = `search:instructors:${JSON.stringify(req.query)}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const [instructors, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          // bio: true,
          // headline: true,
          // avatar: true,
          // website: true,
          // twitter: true,
          // linkedin: true,
          _count: {
            select: {
              coursesCreated: {
                where: { isPublished: true },
              },
            },
          },
        },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    const response = {
      success: true,
      query,
      data: instructors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };

    await redisService.set(cacheKey, JSON.stringify(response), 900); //15 mins

    res.status(200).json(response);
  }
);

///ETING SEARCH SUGGESTIONS
export const getSearchSuggestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { q, limit = 10 } = req.query;

    const query = (q as string).trim();

    if (!query || query.length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const cacheKey = `search:suggestions:${query}:${limit}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    //course Suggestions
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
      },
      orderBy: { enrollmentCount: "desc" },
      take: Number(limit),
    });

    //instructor suggestions
    const instructors = await prisma.user.findMany({
      where: {
        role: "INSTRUCTOR",
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        //   avatar: true
      },
      take: 3,
    });

    //Category suggestions
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 3,
    });

    const response = {
      success: true,
      data: {
        courses,
        instructors,
        categories,
      },
    };

    await redisService.set(cacheKey, JSON.stringify(response), 1800); //30 mins

    res.status(200).json(response);
  }
);
