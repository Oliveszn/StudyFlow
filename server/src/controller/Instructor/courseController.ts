import { Request, Response } from "express";
import prisma from "../../prisma";
import { asyncHandler } from "../../middleware/errorHandler";
import { ApiError } from "../../utils/error";
import { generateSlug } from "../../utils/slug";
import redisService from "../../config/redis";
import { createCourseSchema, updateCourseSchema } from "../../utils/validation";

export const getInstructorCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const instructorId = req.user!.id;
    const { status, page = 1, limit = 10, search } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { instructorId };

    // Filter by publish status if provided
    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    // Search by title
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
  }
);

async function generateUniqueSlug(title: string): Promise<string> {
  let base = generateSlug(title);
  let uniqueSlug = base;
  let counter = 1;

  while (await prisma.course.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${base}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const instructorId = req.user!.id;

    const request = createCourseSchema.parse(req.body);
    ////generate the slug from the title
    const slug = await generateUniqueSlug(request.title);

    /////verify if its an existing cat
    const category = await prisma.category.findUnique({
      where: { name: request.category },
    });
    if (!category) {
      throw ApiError.notFound("Category not found");
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
        thumbnail: request.thumbnail,
        previewVideo: request.previewVideo,
        currency: "NGN",
      },
      include: {
        category: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  }
);

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

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
      throw ApiError.notFound(
        "Course not found or you do not have permission to access it"
      );
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  }
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;
    const updateData = updateCourseSchema.parse(req.body);

    /////check if course exists and belongs to owner
    const existingCourse = await prisma.course.findFirst({
      where: { id, instructorId },
    });

    if (!existingCourse) {
      throw ApiError.notFound(
        "Course not found or you do not have permission to update it"
      );
    }

    let newSlug: string | undefined = undefined;

    /////if the title is being updated we regenerate te slug
    if (updateData.title && updateData.title !== existingCourse.title) {
      newSlug = await generateUniqueSlug(updateData.title);
    }

    const prismaData: any = {
      ...updateData,
      ...(newSlug && { slug: newSlug }),
    };

    ////verify the category exists if its being updated
    if (updateData.category) {
      const category = await prisma.category.findUnique({
        where: { name: updateData.category },
      });

      if (!category) {
        throw ApiError.notFound("Category not found");
      }
      prismaData.categoryId = category.id;
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
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    //verify the couser actually exists and belongs to the owner
    const course = await prisma.course.findFirst({
      where: { id: instructorId },
      include: { _count: { select: { enrollments: true } } },
    });

    if (!course) {
      throw ApiError.notFound(
        "Course not found or you do not have permission to delete it"
      );
    }

    ///we prevent the deletion if course has enrollmenets
    if (course._count.enrollments > 0) {
      throw ApiError.badRequest("Cannot delete coursewith enrollments");
    }

    await prisma.course.delete({ where: { id } });

    await redisService.del(`course:${course.slug}`);
    await redisService.del(`course:${course.id}`);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  }
);

export const publishCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

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
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    ///course should have at least one section with a lesson
    if (course.sections.length === 0) {
      throw ApiError.badRequest(
        "Course must have at least one section before publishing"
      );
    }

    const hasLessons = course.sections.some(
      (section) => section.lessons.length > 0
    );
    if (!hasLessons) {
      throw ApiError.badRequest(
        "Course must have at least one lesson before publishing"
      );
    }

    if (!course.thumbnail) {
      throw ApiError.badRequest(
        "Course must have a thumbnail before publishing"
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
      include: { category: true },
    });

    res.status(200).json({
      success: true,
      message: "Course published successfully",
      data: updatedCourse,
    });
  }
);

export const unpublishCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    ///verify
    const course = await prisma.course.findFirst({
      where: { id, instructorId },
    });

    if (!course) {
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { isPublished: false },
      include: { category: true },
    });

    // Clear cache
    await redisService.del(`course:${updatedCourse.slug}`);
    await redisService.del(`course:${updatedCourse.id}`);

    res.status(200).json({
      success: true,
      message: "Course unpublished successfully",
      data: updatedCourse,
    });
  }
);

export const getCourseAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    //// veri
    const course = await prisma.course.findFirst({
      where: { id, instructorId },
    });

    if (!course) {
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
  }
);
