import { Request, Response } from "express";
import prisma from "../../prisma";
import { asyncHandler } from "../../middleware/errorHandler";
import { ApiError } from "../../utils/error";
import redisService from "../../config/redis";
import {
  createSectionSchema,
  reorderSectionSchema,
  updateSectionSchema,
} from "../../utils/validation";
import logger from "../../utils/logger";

export const createSection = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user!.id;

    logger.info("Create section request received", { instructorId, courseId });

    const request = createSectionSchema.parse(req.body);

    /////verify the course and it elongs to the owner
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId,
      },
    });

    if (!course) {
      logger.warn("Create section failed: course not found or unauthorized", {
        instructorId,
        courseId,
      });
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    // Get the current max order for sections in this course
    const maxOrder = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const nextOrder = maxOrder ? maxOrder.order + 1 : 1;

    const section = await prisma.section.create({
      data: {
        title: request.title,
        description: request.description,
        courseId,
        order: nextOrder,
      },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    });

    await redisService.del(`course:${course.slug}:curriculum`);

    logger.info("Section created successfully", {
      sectionId: section.id,
      courseId,
      instructorId,
    });

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  }
);

export const getSection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const instructorId = req.user!.id;

  logger.info("Fetch section request received", {
    sectionId: id,
    instructorId,
  });

  const section = await prisma.section.findFirst({
    where: {
      id,
      course: {
        instructorId,
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          instructorId: true,
        },
      },
      lessons: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: { lessons: true },
      },
    },
  });

  if (!section) {
    logger.warn("Fetch section failed: not found or unauthorized", {
      sectionId: id,
      instructorId,
    });
    throw ApiError.notFound("Section not found or you do not have permission");
  }

  logger.info("Section fetched successfully", {
    sectionId: section.id,
    courseId: section.courseId,
  });

  res.status(200).json({
    success: true,
    data: section,
  });
});

export const updateSection = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    logger.info("Update section request received", {
      sectionId: id,
      instructorId,
    });

    const request = updateSectionSchema.parse(req.body);

    /////verify the course and it elongs to the owner
    const existingSection = await prisma.section.findFirst({
      where: {
        id,
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

    if (!existingSection) {
      logger.warn("Update section failed: section not found or unauthorized", {
        sectionId: id,
        instructorId,
      });
      throw ApiError.notFound(
        "Section not found or you do not have permission"
      );
    }

    const section = await prisma.section.update({
      where: { id },
      data: {
        title: request.title,
        description: request.description,
      },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    });

    await redisService.del(`course:${existingSection.course.slug}:curriculum`);

    logger.info("Section updated successfully", {
      sectionId: id,
      instructorId,
    });

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  }
);

export const deleteSection = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;

    logger.info("Delete section request received", {
      sectionId: id,
      instructorId,
    });

    /////verify the course and it elongs to the owner
    const section = await prisma.section.findFirst({
      where: {
        id,
        course: {
          instructorId,
        },
      },
      include: {
        course: {
          select: { slug: true },
        },
        _count: {
          select: { lessons: true },
        },
      },
    });

    if (!section) {
      logger.warn("Delete section failed: not found or unauthorized", {
        sectionId: id,
        instructorId,
      });
      throw ApiError.notFound(
        "Section not found or you do not have permission"
      );
    }

    ///verify there are lessons present
    if (section._count.lessons > 0) {
      logger.warn("Delete section blocked: section has lessons", {
        sectionId: id,
        lessonCount: section._count.lessons,
      });
      throw ApiError.badRequest(
        "Cannot delete section with lessons. Delete lessons first."
      );
    }

    /////delete
    await prisma.section.delete({ where: { id } });

    // Reorder remaining sections
    const remainingSections = await prisma.section.findMany({
      where: {
        courseId: section.courseId,
        order: { gt: section.order },
      },
      orderBy: { order: "asc" },
    });

    // Update order for remaining sections
    for (const [index, sec] of remainingSections.entries()) {
      await prisma.section.update({
        where: { id: sec.id },
        data: { order: section.order + index },
      });
    }

    await redisService.del(`course:${section.course.slug}:curriculum`);

    logger.info("Section deleted successfully", {
      sectionId: id,
      instructorId,
    });

    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  }
);

export const reorderSections = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user!.id;

    logger.info("Reorder sections request received", {
      courseId,
      instructorId,
    });
    // const { sectionOrders } = req.body;
    const request = reorderSectionSchema.parse(req.body);

    /////verify the course and it elongs to the owner
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId,
      },
    });

    if (!course) {
      logger.warn("Reorder sections failed: course not found or unauthorized", {
        courseId,
        instructorId,
      });
      throw ApiError.notFound("Course not found or you do not have permission");
    }

    // Verify all sections belong to this course
    const sectionIds = request.sectionOrders.map((item) => item.sectionId);
    const sections = await prisma.section.findMany({
      where: {
        id: { in: sectionIds },
        courseId,
      },
    });

    if (sections.length !== sectionIds.length) {
      logger.warn("Reorder sections failed: invalid section IDs", {
        courseId,
        sectionIds,
      });
      throw ApiError.badRequest(
        "One or more sections not found in this course"
      );
    }

    // Update section orders using a transaction
    await prisma.$transaction(
      request.sectionOrders.map((item) =>
        prisma.section.update({
          where: { id: item.sectionId },
          data: { order: item.order },
        })
      )
    );

    // Get updated sections
    const updatedSections = await prisma.section.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    });

    await redisService.del(`course:${course.slug}:curriculum`);

    logger.info("Sections reordered successfully", {
      courseId,
      instructorId,
    });

    res.status(200).json({
      success: true,
      message: "Sections reordered successfully",
      data: updatedSections,
    });
  }
);
