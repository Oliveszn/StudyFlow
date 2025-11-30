import { asyncHandler } from "../../middleware/errorHandler";
import { Request, Response } from "express";
import prisma from "../../prisma";
import { ApiError } from "../../utils/error";

export const getEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              instructor: {
                select: { firstName: true, lastName: true },
              },
              _count: {
                select: { sections: true },
              },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.enrollment.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: enrollments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

export const enrollInCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { courseId } = req.body;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw ApiError.notFound("Course not found");
    }

    if (!course.isPublished) {
      throw ApiError.badRequest("This course is not available for enrollment");
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw ApiError.badRequest("You are already enrolled in this course");
    }

    // Create enrollment
    // Note: In production, this should be done AFTER successful payment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        pricePaid: course.discountPrice || course.price,
        currency: course.currency,
        status: "ACTIVE",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            instructor: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    // Update course enrollment count
    await prisma.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      data: enrollment,
    });
  }
);

export const getEnrollmentDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            sections: {
              include: {
                lessons: {
                  where: { isPublished: true },
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    order: true,
                    videoDuration: true,
                    isFree: true,
                  },
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw ApiError.notFound("Enrollment not found");
    }

    // Get completed lessons for this user
    const completedLessons = await prisma.lessonProgress.findMany({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          section: {
            courseId: enrollment.courseId,
          },
        },
      },
      select: { lessonId: true },
    });

    const completedLessonIds = completedLessons.map((l) => l.lessonId);

    res.status(200).json({
      success: true,
      data: {
        ...enrollment,
        completedLessonIds,
      },
    });
  }
);
