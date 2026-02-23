import { asyncHandler } from "../middleware/errorHandler";
import redisService from "../config/redis";
import { Request, Response } from "express";
import prisma from "../prisma";
import { ApiError } from "../utils/error";
import { Prisma } from "@prisma/client";

/**
 * @route   GET /api/v1/courses
 * @desc    Get all published courses with filters
 * @access  Public
 */
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 12,
    search,
    categoryId,
    minPrice,
    maxPrice,
    rating,
    language,
    sort = "popular",
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where: Prisma.CourseWhereInput = {
    isPublished: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: "insensitive" } },
      { description: { contains: search as string, mode: "insensitive" } },
    ];
  }

  ///filtering by category
  if (categoryId) {
    where.categoryId = categoryId as string;
  }

  /////filtering by price range
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  ////filtering by rating
  if (rating) {
    where.averageRating = {
      gte: Number(rating),
    };
  }

  /////filterign by language
  if (language) {
    where.language = language as string;
  }

  /////determine sort order
  let orderBy: Prisma.CourseOrderByWithRelationInput = {};

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

  ////check the cache
  const cacheKey = `courses:${JSON.stringify(req.query)}`;
  const cachedData = await redisService.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  /////fetching courses and total count
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
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
    prisma.course.count({ where }),
  ]);

  const response = {
    success: true,
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
});

/**
 * @route   GET /api/v1/courses/:slug
 * @desc    Get course details by slug
 * @access  Public
 */
export const getCourseBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    ///check the cache
    const cacheKey = `course:${slug}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const course = await prisma.course.findUnique({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            sections: true,
          },
        },
      },
    });

    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    ///total lesson count
    const lessonCount = await prisma.lesson.count({
      where: {
        section: {
          courseId: course.id,
        },
      },
    });

    const response = {
      success: true,
      data: {
        ...course,
        lessonCount,
      },
    };

    await redisService.set(cacheKey, JSON.stringify(response), 900); //15 mins

    res.status(200).json(response);
  },
);

/**
 * @route   GET /api/v1/courses/:slug/curriculum
 * @desc    Get course curriculum (sections and lessons)
 * @access  Public
 */
export const getCourseCurriculum = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    const cacheKey = `course:${slug}:curriculum`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const course = await prisma.course.findUnique({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        sections: {
          // where: {
          //   lessons: {
          //     some: {
          //       isPublished: true,
          //     },
          //   },
          // },
          include: {
            lessons: {
              // where: {
              //   OR: [
              //     { isPublished: true, isFree: true }, ///show all published lessons or free lessons
              //     { isPublished: true },
              //   ],
              // },
              // select: {
              //   id: true,
              //   title: true,
              //   description: true,
              //   type: true,
              //   order: true,
              //   videoDuration: true,
              //   isFree: true,
              //   isPublished: true,
              // },
              orderBy: { order: "asc" },
            },
            _count: {
              select: { lessons: true },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    ////// Get the total duration
    const totalDuration = await prisma.lesson.aggregate({
      where: {
        section: {
          courseId: course.id,
        },
        // isPublished: true,
      },
      _sum: {
        videoDuration: true,
      },
    });

    const response = {
      success: true,
      data: {
        ...course,
        totalDuration: totalDuration._sum.videoDuration || 0,
        totalSections: course.sections.length,
        totalLessons: course.sections.reduce(
          (acc, section) => acc + section._count.lessons,
          0,
        ),
      },
    };

    await redisService.set(cacheKey, JSON.stringify(response), 900); //15mins

    res.status(200).json(response);
  },
);

/**
 * @route   GET /api/v1/courses/:slug/reviews
 * @desc    Get course reviews
 * @access  Public
 */
export const getCourseReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    //////getting the course id from the slug
    const course = await prisma.course.findUnique({
      where: { slug, isPublished: true },
      select: { id: true },
    });

    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    ////where clause for reviews
    const where: Prisma.ReviewWhereInput = {
      courseId: course.id,
    };

    ////filtering by rating
    if (rating) {
      where.rating = Number(rating);
    }

    /////fetching freviews and total count
    const [reviews, total, ratingDistribution] = await Promise.all([
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
      //rating distribution
      prisma.review.groupBy({
        by: ["rating"],
        where: { courseId: course.id },
        _count: { rating: true },
      }),
    ]);

    ////format rating distribution
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

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      ratingDistribution: distribution,
    });
  },
);

/**
 * @route   GET /api/v1/courses/featured
 * @desc    Get featured courses
 * @access  Public
 */
export const getFeaturedCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit = 6 } = req.query;

    const cacheKey = `courses:featured:${limit}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    /////get courses with higest rating and enrollmensts
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        averageRating: { gte: 4.5 },
        enrollmentCount: { gte: 10 },
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ averageRating: "desc" }, { enrollmentCount: "desc" }],
      take: Number(limit),
    });

    const response = {
      success: true,
      data: courses,
    };

    await redisService.set(cacheKey, JSON.stringify(response), 1800); //30mins

    res.status(200).json(response);
  },
);

/**
 * @route   GET /api/v1/courses/trending
 * @desc    Get trending courses (most enrollments in last 30 days)
 * @access  Public
 */
export const getTrendingCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit = 6 } = req.query;

    const cacheKey = `courses:trending:${limit}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    /////get date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    /////courses with most recent enrollments
    const recentEnrollments = await prisma.enrollment.groupBy({
      by: ["courseId"],
      where: {
        enrolledAt: { gte: thirtyDaysAgo },
      },
      _count: { courseId: true },
      orderBy: { _count: { courseId: "desc" } },
      take: Number(limit),
    });

    ////course details for trending courses
    const courseIds = recentEnrollments.map((e) => e.courseId);

    const courses = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
        isPublished: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    /////sortin the courses by enrollment count
    const sortedCourses = courses.sort((a, b) => {
      const aCount =
        recentEnrollments.find((e) => e.courseId === a.id)?._count.courseId ||
        0;
      const bCount =
        recentEnrollments.find((e) => e.courseId === b.id)?._count.courseId ||
        0;
      return bCount - aCount;
    });

    const response = {
      success: true,
      data: sortedCourses,
    };

    await redisService.set(cacheKey, JSON.stringify(response), 3600); //1hr

    res.status(200).json(response);
  },
);
