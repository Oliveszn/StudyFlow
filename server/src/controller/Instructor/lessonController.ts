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
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../../middleware/cloudinary";
import logger from "../../utils/logger";

export const createLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    const instructorId = req.user!.id;

    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    logger.info("Create lesson ", {
      sectionId: req.params.sectionId,
      instructorId: req.user?.id,
    });

    if (!req.body || Object.keys(req.body).length === 0) {
      throw ApiError.badRequest("Request body is empty");
    }

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
      logger.warn("Create lesson failed, Section not found", {
        sectionId,
        instructorId,
      });
      throw ApiError.notFound(
        "Section not found or you do not have permission"
      );
    }

    if (request.type === "ARTICLE" && !request.articleContent) {
      logger.warn("Article content missing", { sectionId });
      throw ApiError.badRequest(
        "Article content is required for article lessons"
      );
    }

    let videoUrl = null;
    let videoPublicId = null;
    let videoDuration = null;

    if (request.type === "VIDEO") {
      logger.warn("Video file missing", { sectionId });
      if (!req.file) {
        throw ApiError.badRequest("Video file is required");
      }

      const uploadResult: any = await uploadMediaToCloudinary(req.file);

      videoUrl = uploadResult.secure_url;
      videoPublicId = uploadResult.public_id;
      videoDuration = uploadResult.duration;
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
        videoUrl,
        videoPublicId,
        videoDuration,
        articleContent: request.articleContent,
        isFree: request.isFree || false,
        isPublished: false,
      },
    });

    await redisService.del(`course:${section.course.slug}:curriculum`);

    logger.info("Lesson created", {
      lessonId: lesson.id,
      sectionId,
      instructorId,
    });

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

  logger.info("Get lesson ", { lessonId: id, instructorId });

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
    logger.warn("Lesson not found", { lessonId: id, instructorId });
    throw ApiError.notFound("Lesson not found or you do not have permission");
  }

  logger.info("Lesson fetched succesfully", { lessonId: id });

  res.status(200).json({
    success: true,
    data: lesson,
  });
});

export const updateLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    logger.info("Update lesson", { lessonId: id, instructorId });

    const updateData = updateLessonSchema.parse(req.body);

    const existingLesson = await prisma.lesson.findFirst({
      where: {
        id,
        section: {
          course: { instructorId },
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
      logger.warn("Lesson not found", { lessonId: id, instructorId });
      throw ApiError.notFound("Lesson not found or you do not have permission");
    }

    const prismaData: any = { ...updateData };

    ///when switching type to video and no video uploaded
    if (updateData.type === "VIDEO" && existingLesson.type !== "VIDEO") {
      if (!req.file) {
        logger.warn("No video provided", { lessonId: id });
        throw ApiError.badRequest(
          "Video file is required when changing to video lesson"
        );
      }
    }

    if (updateData.type === "ARTICLE" && existingLesson.type !== "ARTICLE") {
      if (!updateData.articleContent) {
        throw ApiError.badRequest(
          "Article content is required when changing to article lesson"
        );
      }

      //// delete the old video when switching from video to article
      if (existingLesson.videoPublicId) {
        await deleteMediaFromCloudinary(existingLesson.videoPublicId);
      }

      prismaData.videoUrl = null;
      prismaData.videoPublicId = null;
      prismaData.videoDuration = null;
    }

    ///delete old video if changing it
    if (
      (existingLesson.type === "VIDEO" || updateData.type === "VIDEO") &&
      req.file
    ) {
      if (existingLesson.videoPublicId) {
        await deleteMediaFromCloudinary(existingLesson.videoPublicId);
      }

      const uploadResult: any = await uploadMediaToCloudinary(req.file);

      prismaData.videoUrl = uploadResult.secure_url;
      prismaData.videoPublicId = uploadResult.public_id;
      prismaData.videoDuration = uploadResult.duration;
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: prismaData,
    });

    await redisService.del(
      `course:${existingLesson.section.course.slug}:curriculum`
    );

    logger.info("Lesson updated", { lessonId: id });

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

    logger.warn("Delete Lesson", { lessonId: id, instructorId });

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
      logger.warn("Lesson not found", { lessonId: id });
      throw ApiError.notFound("Lesson not found or you do not have permission");
    }

    if (lesson.videoPublicId) {
      await deleteMediaFromCloudinary(lesson.videoPublicId);
    }

    await prisma.lesson.delete({ where: { id } });

    ///Reorder the remaining lesson in the sect
    const remainingLessons = await prisma.lesson.findMany({
      where: {
        sectionId: lesson.sectionId,
        order: { gt: lesson.order },
      },
      orderBy: { order: "asc" },
    });

    ///update remaining lesson order
    for (const [index, les] of remainingLessons.entries()) {
      await prisma.lesson.update({
        where: { id: les.id },
        data: { order: lesson.order + index },
      });
    }

    await redisService.del(`course:${lesson.section.course.slug}:curriculum`);

    logger.warn("Lesson deleted", { lessonId: id });

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
    logger.info("Reorder lessons", { sectionId, instructorId });
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
      logger.warn("Reorder section not found", { sectionId });
      throw ApiError.notFound(
        "Section not found or you do not have permission"
      );
    }

    ///Check if all lesons belong to the section
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

    ////Get the updated lessons
    const updatedLessons = await prisma.lesson.findMany({
      where: { sectionId },
      orderBy: { order: "asc" },
    });

    await redisService.del(`course:${section.course.slug}:curriculum`);

    logger.info("LESSONS_REORDERED", { sectionId });

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
    logger.info("Add attachemnt", { instructorId });
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

    ////Get exisitng attachments
    const existingAttachments = (lesson.attachments as any[]) || [];

    ////Create a new attachment with id
    const newAttachment = {
      id: `att_${Date.now()}`,
      name: request.name,
      url: request.url,
      size: request.size,
      addedAt: new Date().toISOString(),
    };

    ///Add a new attachment
    const updatedAttachments = [...existingAttachments, newAttachment];

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: { attachments: updatedAttachments },
    });

    await redisService.del(`course:${lesson.section.course.slug}:curriculum`);

    logger.info("Attachment added", {
      lessonId: id,
      attachment: newAttachment,
    });

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
    logger.info("Delete attachemnt", { instructorId });
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

    ///Get the existing attachments
    const existingAttachments = (lesson.attachments as any[]) || [];

    ////Find and remove attachments
    const updatedAttachments = existingAttachments.filter(
      (att: any) => att.id !== attachmentId
    );

    if (updatedAttachments.length === existingAttachments.length) {
      throw ApiError.notFound("Attachment not found");
    }

    ////Update Lesson
    await prisma.lesson.update({
      where: { id },
      data: { attachments: updatedAttachments },
    });

    await redisService.del(`course:${lesson.section.course.slug}:curriculum`);

    logger.warn("Attachement deleted", { lessonId: id, attachmentId });

    res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
    });
  }
);
