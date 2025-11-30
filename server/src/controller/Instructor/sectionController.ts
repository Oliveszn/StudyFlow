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

export const createSection = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user!.id;
    const request = createSectionSchema.parse(req.body);

    /////verify the course and it elongs to the owner
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId,
      },
    });

    if (!course) {
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
    throw ApiError.notFound("Section not found or you do not have permission");
  }

  res.status(200).json({
    success: true,
    data: section,
  });
});

export const updateSection = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user!.id;
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
      throw ApiError.notFound(
        "Section not found or you do not have permission"
      );
    }

    ///verify there are lessons present
    if (section._count.lessons > 0) {
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

    res.status(200).json({
      success: true,
      message: "Sections reordered successfully",
      data: updatedSections,
    });
  }
);
