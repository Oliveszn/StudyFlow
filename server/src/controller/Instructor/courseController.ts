import { Request, Response } from "express";
import prisma from "../../prisma";
import { asyncHandler } from "../../middleware/errorHandler";
import { ApiError } from "../../utils/error";
import redisService from "../../config/redis";
import { createCourseSchema, updateCourseSchema } from "../../utils/validation";
import { generateUniqueSlug } from "../../utils/slug";
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../../middleware/cloudinary";
import logger from "../../utils/logger";

/**
 * @route   GET /api/v1/instructor/courses
 * @desc    Get all courses for the authenticated instructor
 * @access  Private (Instructor)
 */
export const getInstructorCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const instructorId = req.user!.id;
    const { status, page = 1, limit = 10, search } = req.query;

    logger.info("Fetching instructor courses", {
      instructorId,
      status,
      page,
      limit,
      search,
    });

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { instructorId };

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    if (search) {
      where.title = { contains: search as string, mode: "insensitive" };
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          _count: { select: { enrollments: true, sections: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.course.count({ where }),
    ]);

    logger.info("Instructor courses fetched", {
      instructorId,
      returned: courses.length,
      total,
    });

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  },
);

/**
 * @route   POST /api/v1/instructor/courses
 * @desc    Create a new course
 * @access  Private (Instructor)
 */
export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const instructorId = req.user!.id;
    logger.info("Create course request received", { instructorId });

    const request = createCourseSchema.parse(req.body);
    ////generate the slug from the title
    const slug = await generateUniqueSlug(request.title);

    /////verify if its an existing cat
    const category = await prisma.category.findUnique({
      where: { id: request.category },
    });
    if (!category) {
      logger.warn("Invalid category during course creation", {
        instructorId,
        category: request.category,
      });
      throw ApiError.notFound("Category not found");
    }

    // let thumbnailUrl = null;
    let thumbnailUrl: string | undefined;
    let thumbnailPublicId = null;

    if (req.file) {
      logger.info("Uploading course thumbnail", { instructorId });
      const uploadResult: any = await uploadMediaToCloudinary(req.file);

      thumbnailUrl = uploadResult.secure_url;
      thumbnailPublicId = uploadResult.public_id;
    }

    const course = await prisma.course.create({
      data: {
        title: request.title,
        slug,
        subtitle: request.subtitle,
        description: request.description,
        categoryId: category.id,
        instructorId,
        price: request.price,
        discountPrice: request.discountPrice,
        language: request.language || "en",
        requirements: request.requirements || [],
        whatYouWillLearn: request.whatYouWillLearn || [],
        thumbnail: thumbnailUrl,
        thumbnailPublicId,
        currency: "NGN",
      },
      include: {
        category: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    logger.info("Course created successfully", {
      courseId: course.id,
      instructorId,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  },
);

/**
 * @route   GET /api/v1/instructor/courses/:id
 * @desc    Get course details by ID
 * @access  Private (Instructor - own courses only)
 */
export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    logger.info("Fetching single course", { courseId: id, instructorId });

    const course = await prisma.course.findFirst({
      where: {
        id,
        instructorId,
      },
      include: {
        category: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        sections: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
    });

    if (!course) {
      logger.warn("Unauthorized course access attempt", {
        courseId: id,
        instructorId,
      });
      throw ApiError.notFound(
        "Course not found or you do not have permission to access it",
      );
    }

    logger.info("Course fetched successfully", { courseId: id });

    res.status(200).json({
      success: true,
      data: course,
    });
  },
);

/**
 * @route   PUT /api/v1/instructor/courses/:id
 * @desc    Update course
 * @access  Private (Instructor - own courses only)
 */
export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;
    const updateData = updateCourseSchema.parse(req.body);

    logger.info("Course fetched successfully", { courseId: id });

    /////check if course exists and belongs to owner
    const existingCourse = await prisma.course.findFirst({
      where: { id, instructorId },
    });

    if (!existingCourse) {
      logger.warn("Unauthorized course update attempt", {
        courseId: id,
        instructorId,
      });
      throw ApiError.notFound(
        "Course not found or you do not have permission to update it",
      );
    }

    let newSlug: string | undefined = undefined;

    /////if the title is being updated we regenerate te slug
    if (updateData.title && updateData.title !== existingCourse.title) {
      newSlug = await generateUniqueSlug(updateData.title);
      logger.info("Course slug regenerated", { courseId: id });
    }

    const prismaData: any = {
      ...updateData,
      ...(newSlug && { slug: newSlug }),
    };
    delete prismaData.category;

    ////verify the category exists if its being updated
    if (updateData.category) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.category },
      });

      if (!category) {
        logger.warn("Invalid category during course update", {
          courseId: id,
          category: updateData.category,
        });
        throw ApiError.notFound("Category not found");
      }
      prismaData.categoryId = category.id;
    }

    if (req.file) {
      if (existingCourse.thumbnailPublicId) {
        await deleteMediaFromCloudinary(existingCourse.thumbnailPublicId);
        logger.info("Old thumbnail deleted", { courseId: id });
      }

      const uploadResult: any = await uploadMediaToCloudinary(req.file);

      prismaData.thumbnail = uploadResult.secure_url;
      prismaData.thumbnailPublicId = uploadResult.public_id;
    }

    const course = await prisma.course.update({
      where: { id },
      data: prismaData,
      include: {
        category: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    /////invalidate the cache
    if (course.isPublished) {
      await redisService.del(`course:${course.slug}`);
      await redisService.del(`course:${course.id}`);
      logger.info("Course cache invalidated", { courseId: id });
    }

    logger.info("Course updated successfully", { courseId: id });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  },
);

/**
 * @route   DELETE /api/v1/instructor/courses/:id
 * @desc    Delete course
 * @access  Private (Instructor - own courses only)
 */
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    logger.info("Delete course request", { courseId: id, instructorId });

    //verify the couser actually exists and belongs to the owner
    const course = await prisma.course.findFirst({
      where: { id, instructorId },
      include: { _count: { select: { enrollments: true } } },
    });

    if (!course) {
      logger.warn("Unauthorized delete attempt", {
        courseId: id,
        instructorId,
      });
      throw ApiError.notFound(
        "Course not found or you do not have permission to delete it",
      );
    }

    ///we prevent the deletion if course has enrollmenets
    if (course._count.enrollments > 0) {
      logger.warn("Delete blocked due to enrollments", {
        courseId: id,
        enrollments: course._count.enrollments,
      });
      throw ApiError.badRequest("Cannot delete coursewith enrollments");
    }

    ///delete from cloudinary
    if (course.thumbnailPublicId) {
      await deleteMediaFromCloudinary(course.thumbnailPublicId);
      logger.info("Deleted course thumbnail", { courseId: id });
    }

    await prisma.course.delete({ where: { id } });

    await redisService.del(`course:${course.slug}`);
    await redisService.del(`course:${course.id}`);

    logger.info("Course deleted successfully", { courseId: id });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  },
);

/**
 * @route   PATCH /api/v1/instructor/courses/:id/publish
 * @desc    Publish a course
 * @access  Private (Instructor - own courses only)
 */
export const publishCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    logger.info("Publish course request", { courseId: id, instructorId });

    ///verify course and owner
    const course = await prisma.course.findFirst({
      where: { id, instructorId },
      include: {
        sections: {
          include: { lessons: true },
        },
      },
    });

    if (!course) {
      logger.warn("Unauthorized publish attempt", {
        courseId: id,
        instructorId,
      });
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    ///course should have at least one section with a lesson
    if (course.sections.length === 0) {
      throw ApiError.badRequest(
        "Course must have at least one section before publishing",
      );
    }

    const hasLessons = course.sections.some(
      (section) => section.lessons.length > 0,
    );
    if (!hasLessons) {
      throw ApiError.badRequest(
        "Course must have at least one lesson before publishing",
      );
    }

    if (!course.thumbnail) {
      throw ApiError.badRequest(
        "Course must have a thumbnail before publishing",
      );
    }

    await prisma.lesson.updateMany({
      where: {
        section: {
          courseId: id,
        },
      },
      data: {
        isPublished: true,
      },
    });

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
      include: { category: true },
    });

    await redisService.del(`course:${updatedCourse.slug}`);
    await redisService.del(`course:${updatedCourse.id}`);
    await redisService.del(`course:${updatedCourse.slug}:curriculum`);

    logger.info("Course published", { courseId: id });

    res.status(200).json({
      success: true,
      message: "Course published successfully",
      data: updatedCourse,
    });
  },
);

/**
 * @route   PATCH /api/v1/instructor/courses/:id/unpublish
 * @desc    Unpublish a course
 * @access  Private (Instructor - own courses only)
 */
export const unpublishCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    logger.info("Unpublish course request", { courseId: id, instructorId });

    ///verify
    const course = await prisma.course.findFirst({
      where: { id, instructorId },
    });

    if (!course) {
      logger.warn("Unauthorized unpublish attempt", {
        courseId: id,
        instructorId,
      });
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { isPublished: false },
      include: { category: true },
    });

    await redisService.del(`course:${updatedCourse.slug}`);
    await redisService.del(`course:${updatedCourse.id}`);
    await redisService.del(`course:${updatedCourse.slug}:curriculum`);

    logger.info("Course unpublished", { courseId: id });

    res.status(200).json({
      success: true,
      message: "Course unpublished successfully",
      data: updatedCourse,
    });
  },
);

/**
 * @route   GET /api/v1/instructor/courses/:id/analytics
 * @desc    Get course analytics
 * @access  Private (Instructor - own courses only)
 */
export const getCourseAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    logger.warn("Unauthorized unpublish attempt", {
      courseId: id,
      instructorId,
    });

    //// veri
    const course = await prisma.course.findFirst({
      where: { id, instructorId },
    });

    if (!course) {
      logger.warn("Unauthorized analytics access", {
        courseId: id,
        instructorId,
      });
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    ////get the analytics data
    const [
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalRevenue,
      averageProgress,
      recentEnrollments,
    ] = await Promise.all([
      //total enrollments
      prisma.enrollment.count({
        where: { courseId: id },
      }),

      //active enrollments
      prisma.enrollment.count({
        where: { courseId: id, status: "ACTIVE" },
      }),

      //completed enrollments
      prisma.enrollment.count({
        where: { courseId: id, status: "COMPLETED" },
      }),

      //all revenue
      prisma.enrollment.aggregate({
        where: { courseId: id },
        _sum: { pricePaid: true },
      }),

      /////avergae progress
      prisma.enrollment.aggregate({
        where: { courseId: id, status: "ACTIVE" },
        _avg: { progress: true },
      }),

      /////last 10 enrollments
      prisma.enrollment.findMany({
        where: { courseId: id },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { enrolledAt: "desc" },
        take: 10,
      }),
    ]);

    logger.info("Course analytics fetched", {
      courseId: id,
      totalEnrollments,
      revenue: totalRevenue._sum.pricePaid || 0,
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          completionRate:
            totalEnrollments > 0
              ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2)
              : 0,
          totalRevenue: totalRevenue._sum.pricePaid || 0,
          averageProgress: averageProgress._avg.progress || 0,
        },
        recentEnrollments,
        course: {
          id: course.id,
          title: course.title,
          averageRating: course.averageRating,
          reviewCount: course.reviewCount,
        },
      },
    });
  },
);
