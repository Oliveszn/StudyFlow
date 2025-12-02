import { asyncHandler } from "../../middleware/errorHandler";
import prisma from "../../prisma";
import { Request, Response } from "express";
import { generateSlug } from "../../utils/slug";
import { ApiError } from "../../utils/error";
import redisService from "../../config/redis";

///GET ALL CATEGORIES
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              courses: true,
            },
          },
        },
        orderBy: { name: "asc" },
        skip,
        take: Number(limit),
      }),
      prisma.category.count(),
    ]);

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      courseCount: cat._count.courses,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedCategories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

///CREATE NEW CAT
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    // Generate slug from name
    const slug = generateSlug(name);

    // Check if category with this slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw ApiError.badRequest("A category with this name already exists");
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    await redisService.del("categories:all");

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  }
);

////UPDATING A CATEGORY
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw ApiError.notFound("Category not found");
    }

    // Generate new slug if name changed
    const slug = name ? generateSlug(name) : existingCategory.slug;

    // Check if new slug conflicts with another category
    if (slug !== existingCategory.slug) {
      const conflictingCategory = await prisma.category.findUnique({
        where: { slug },
      });

      if (conflictingCategory) {
        throw ApiError.badRequest("A category with this name already exists");
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    // Clear caches
    await redisService.del("categories:all");
    await redisService.del(`category:${existingCategory.slug}`);
    if (slug !== existingCategory.slug) {
      await redisService.del(`category:${slug}`);
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  }
);

///DELETING CATEGORY
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    // Prevent deletion if category has courses
    if (category._count.courses > 0) {
      throw ApiError.badRequest(
        `Cannot delete category with ${category._count.courses} courses. Please move or delete the courses first.`
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    // Clear caches
    await redisService.del("categories:all");
    await redisService.del(`category:${category.slug}`);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
);
