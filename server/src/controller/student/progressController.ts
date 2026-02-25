import { asyncHandler } from "../../middleware/errorHandler";
import { Request, Response } from "express";
import prisma from "../../prisma";
import { ApiError } from "../../utils/error";

export const getCourseProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user!.id;

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw ApiError.forbidden("You are not enrolled in this course");
    }

    // Get all lessons in the course
    const totalLessons = await prisma.lesson.count({
      where: {
        section: { courseId },
        isPublished: true,
      },
    });

    // Get completed lessons
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          section: { courseId },
          isPublished: true,
        },
      },
    });

    // Calculate progress percentage
    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Update enrollment progress
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress: progressPercentage },
    });

    // Get lesson progress details
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lesson: {
          section: { courseId },
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
            sectionId: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        enrollmentId: enrollment.id,
        courseId,
        totalLessons,
        completedLessons,
        progressPercentage,
        lastAccessedAt: enrollment.lastAccessedAt,
        lessonProgress,
      },
    });
  },
);

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const userId = req.user!.id;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      section: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lesson || !lesson.isPublished) {
    throw ApiError.notFound("Lesson not found");
  }

  // Check if lesson is free or user is enrolled
  if (!lesson.isFree) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.section.course.id,
        },
      },
    });

    if (!enrollment) {
      throw ApiError.forbidden("You must be enrolled to access this lesson");
    }
  }

  // Get or create lesson progress
  let progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });

  if (!progress) {
    progress = await prisma.lessonProgress.create({
      data: {
        userId,
        lessonId,
      },
    });
  }

  // Update last accessed time for enrollment
  await prisma.enrollment.updateMany({
    where: {
      userId,
      courseId: lesson.section.course.id,
    },
    data: {
      lastAccessedAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    data: {
      lesson,
      progress,
    },
  });
});

export const getLessonVideoUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const userId = req.user!.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: {
            course: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!lesson || lesson.type !== "VIDEO") {
      throw ApiError.notFound("Video lesson not found");
    }

    // Check enrollment or free access
    if (!lesson.isFree) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.section.course.id,
          },
        },
      });

      if (!enrollment) {
        throw ApiError.forbidden("You must be enrolled to access this video");
      }
    }

    // TODO: Generate signed URL for video streaming
    // This would integrate with your video provider (Vimeo, AWS S3 + CloudFront, etc.)

    // Example for AWS S3 + CloudFront:
    // const signedUrl = generateCloudFrontSignedUrl(lesson.videoUrl, 3600);

    // For now, return the video URL directly
    const videoUrl = lesson.videoUrl;

    res.status(200).json({
      success: true,
      data: {
        videoUrl,
        expiresIn: 3600, // 1 hour
      },
    });
  },
);

export const markLessonComplete = asyncHandler(
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const userId = req.user!.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: {
            course: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw ApiError.notFound("Lesson not found");
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.section.course.id,
        },
      },
    });

    if (!enrollment) {
      throw ApiError.forbidden("You must be enrolled to complete this lesson");
    }

    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Recalculate course progress
    const totalLessons = await prisma.lesson.count({
      where: {
        section: { courseId: lesson.section.course.id },
        isPublished: true,
      },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          section: { courseId: lesson.section.course.id },
          isPublished: true,
        },
      },
    });

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Update enrollment progress
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercentage,
        ...(progressPercentage === 100 && {
          status: "COMPLETED",
          completedAt: new Date(),
        }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Lesson marked as complete",
      data: {
        progress,
        courseProgress: progressPercentage,
      },
    });
  },
);

export const updateVideoProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const userId = req.user!.id;
    const { watchedDuration } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: {
            course: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!lesson || lesson.type !== "VIDEO") {
      throw ApiError.notFound("Video lesson not found");
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.section.course.id,
        },
      },
    });

    if (!enrollment) {
      throw ApiError.forbidden("You must be enrolled to track progress");
    }

    // Update progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        watchedDuration,
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        watchedDuration,
      },
    });

    res.status(200).json({
      success: true,
      data: progress,
    });
  },
);

export const getStudentDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Get active enrollments
    const activeEnrollments = await prisma.enrollment.findMany({
      where: {
        userId,
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
      orderBy: { lastAccessedAt: "desc" },
      take: 5,
    });

    // Get recently completed lessons
    const recentlyCompleted = await prisma.lessonProgress.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            section: {
              select: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 10,
    });

    // Get stats
    const [totalEnrolled, totalCompleted, totalInProgress] = await Promise.all([
      prisma.enrollment.count({ where: { userId } }),
      prisma.enrollment.count({ where: { userId, status: "COMPLETED" } }),
      prisma.enrollment.count({ where: { userId, status: "ACTIVE" } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEnrolled,
          totalCompleted,
          totalInProgress,
        },
        continueWatching: activeEnrollments,
        recentlyCompleted,
      },
    });
  },
);
