import { Request, Response } from "express";
import prisma from "../../prisma";
import { asyncHandler } from "../../middleware/errorHandler";
import { ApiError } from "../../utils/error";
import redisService from "../../config/redis";
import {
  addAttachmentSchema,
  createLessonSchema,
  reorderLessonSchema,
  updateLessonSchema,
} from "../../utils/validation";

export const createLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    const instructorId = req.user!.id;

    const request = createLessonSchema.parse(req.body);

    ////verify te section exists and it belongs to the instructor's cousre
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        course: {
          instructorId,
        },
      },
      include: {
        course: {
          select: { slug: true },
        },
      },
    });

    if (!section) {
      throw ApiError.notFound(
        "Section not found or you do not have permission"
      );
    }

    if (request.type === "VIDEO" && !request.videoUrl) {
      throw ApiError.badRequest("Video URL is required for video lessons");
    }

    if (request.type === "ARTICLE" && !request.articleContent) {
      throw ApiError.badRequest(
        "Article content is required for article lessons"
      );
    }

    // Get the current max order for lessons in this section
    const maxOrder = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = maxOrder ? maxOrder.order + 1 : 1;

    const lesson = await prisma.lesson.create({
      data: {
        title: request.title,
        description: request.description,
        type: request.type,
        sectionId,
        order: nextOrder,
        videoUrl: request.videoUrl,
        videoProvider: request.videoProvider,
        videoDuration: request.videoDuration,
        articleContent: request.articleContent,
        isFree: request.isFree || false,
        isPublished: false, // Default to unpublished
      },
    });

    await redisService.del(`course:${section.course.slug}:curriculum`);

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: lesson,
    });
  }
);

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const instructorId = req.user!.id;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id,
      section: {
        course: {
          instructorId,
        },
      },
    },
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

  if (!lesson) {
    throw ApiError.notFound("Lesson not found or you do not have permission");
  }

  res.status(200).json({
    success: true,
    data: lesson,
  });
});

export const updateLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    const updateData = updateLessonSchema.parse(req.body);

    ////verify te section exists and it belongs to the instructor's cousre
    const existingLesson = await prisma.lesson.findFirst({
      where: {
        id,
        section: {
          course: {
            instructorId,
          },
        },
      },
      include: {
        section: {
          include: {
            course: {
              select: { slug: true },
            },
          },
        },
      },
    });

    if (!existingLesson) {
      throw ApiError.notFound("Lesson not found or you do not have permission");
    }

    if (updateData.type === "VIDEO" && existingLesson.type !== "VIDEO") {
      if (!updateData.videoUrl) {
        throw ApiError.badRequest(
          "Video URL is required when changing to video lesson"
        );
      }
    }

    if (updateData.type === "ARTICLE" && existingLesson.type !== "ARTICLE") {
      if (!updateData.articleContent) {
        throw ApiError.badRequest(
          "Article content is required when changing to article lesson"
        );
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
    });

    await redisService.del(
      `course:${existingLesson.section.course.slug}:curriculum`
    );

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: lesson,
    });
  }
);

export const deleteLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    ////verify te section exists and it belongs to the instructor's cousre
    const lesson = await prisma.lesson.findFirst({
      where: {
        id,
        section: {
          course: {
            instructorId,
          },
        },
      },
      include: {
        section: {
          include: {
            course: {
              select: { slug: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw ApiError.notFound("Lesson not found or you do not have permission");
    }

    // Delete lesson
    await prisma.lesson.delete({ where: { id } });

    // Reorder remaining lessons in the section
    const remainingLessons = await prisma.lesson.findMany({
      where: {
        sectionId: lesson.sectionId,
        order: { gt: lesson.order },
      },
      orderBy: { order: "asc" },
    });

    // Update order for remaining lessons
    for (const [index, les] of remainingLessons.entries()) {
      await prisma.lesson.update({
        where: { id: les.id },
        data: { order: lesson.order + index },
      });
    }

    await redisService.del(`course:${lesson.section.course.slug}:curriculum`);

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  }
);

export const reorderLessons = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    const instructorId = req.user!.id;
    //   const { lessonOrders } = req.body;
    const request = reorderLessonSchema.parse(req.body);

    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        course: {
          instructorId,
        },
      },
      include: {
        course: {
          select: { slug: true },
        },
      },
    });

    if (!section) {
      throw ApiError.notFound(
        "Section not found or you do not have permission"
      );
    }

    // Verify all lessons belong to this section
    const lessonIds = request.lessonOrders.map((item) => item.lessonId);
    const lessons = await prisma.lesson.findMany({
      where: {
        id: { in: lessonIds },
        sectionId,
      },
    });

    if (lessons.length !== lessonIds.length) {
      throw ApiError.badRequest(
        "One or more lessons not found in this section"
      );
    }

    // Update lesson orders using a transaction
    await prisma.$transaction(
      request.lessonOrders.map((item) =>
        prisma.lesson.update({
          where: { id: item.lessonId },
          data: { order: item.order },
        })
      )
    );

    // Get updated lessons
    const updatedLessons = await prisma.lesson.findMany({
      where: { sectionId },
      orderBy: { order: "asc" },
    });

    await redisService.del(`course:${section.course.slug}:curriculum`);

    res.status(200).json({
      success: true,
      message: "Lessons reordered successfully",
      data: updatedLessons,
    });
  }
);

export const generateVideoUploadUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;
    const { fileName, fileType } = req.body;

    const lesson = await prisma.lesson.findFirst({
      where: {
        id,
        section: {
          course: {
            instructorId,
          },
        },
      },
    });

    if (!lesson) {
      throw ApiError.notFound("Lesson not found or you do not have permission");
    }

    if (lesson.type !== "VIDEO") {
      throw ApiError.badRequest("Can only upload videos to video lessons");
    }

    // TODO: Integrate with your storage provider (AWS S3, Cloudinary, etc.)
    // For now, return a mock response

    // Example with AWS S3:
    // const s3 = new AWS.S3();
    // const key = `courses/${lesson.section.course.id}/lessons/${lesson.id}/${Date.now()}-${fileName}`;
    // const signedUrl = await s3.getSignedUrlPromise('putObject', {
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: key,
    //   ContentType: fileType,
    //   Expires: 300 // 5 minutes
    // });

    const mockUploadUrl = `https://your-storage.com/upload/${id}`;
    const mockVideoUrl = `https://your-cdn.com/videos/${id}/${fileName}`;

    res.status(200).json({
      success: true,
      message: "Upload URL generated successfully",
      data: {
        uploadUrl: mockUploadUrl,
        videoUrl: mockVideoUrl, // URL to save in database after upload
        expiresIn: 300, // seconds
      },
    });
  }
);

export const addAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;
    //   const { name, url, size } = req.body;
    const request = addAttachmentSchema.parse(req.body);

    const lesson = await prisma.lesson.findFirst({
      where: {
        id,
        section: {
          course: {
            instructorId,
          },
        },
      },
      include: {
        section: {
          include: {
            course: {
              select: { slug: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw ApiError.notFound("Lesson not found or you do not have permission");
    }

    // Get existing attachments
    const existingAttachments = (lesson.attachments as any[]) || [];

    // Create new attachment with ID
    const newAttachment = {
      id: `att_${Date.now()}`,
      name: request.name,
      url: request.url,
      size: request.size,
      addedAt: new Date().toISOString(),
    };

    // Add new attachment
    const updatedAttachments = [...existingAttachments, newAttachment];

    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: { attachments: updatedAttachments },
    });

    // Clear course curriculum cache
    await redisService.del(`course:${lesson.section.course.slug}:curriculum`);

    res.status(200).json({
      success: true,
      message: "Attachment added successfully",
      data: {
        lesson: updatedLesson,
        attachment: newAttachment,
      },
    });
  }
);

export const deleteAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, attachmentId } = req.params;
    const instructorId = req.user!.id;

    const lesson = await prisma.lesson.findFirst({
      where: {
        id,
        section: {
          course: {
            instructorId,
          },
        },
      },
      include: {
        section: {
          include: {
            course: {
              select: { slug: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw ApiError.notFound("Lesson not found or you do not have permission");
    }

    // Get existing attachments
    const existingAttachments = (lesson.attachments as any[]) || [];

    // Find and remove attachment
    const updatedAttachments = existingAttachments.filter(
      (att: any) => att.id !== attachmentId
    );

    if (updatedAttachments.length === existingAttachments.length) {
      throw ApiError.notFound("Attachment not found");
    }

    // Update lesson
    await prisma.lesson.update({
      where: { id },
      data: { attachments: updatedAttachments },
    });

    // Clear course curriculum cache
    await redisService.del(`course:${lesson.section.course.slug}:curriculum`);

    res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
    });
  }
);
