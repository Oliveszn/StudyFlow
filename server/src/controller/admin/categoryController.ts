import { asyncHandler } from "../../middleware/errorHandler";
import prisma from "../../prisma";
import { Request, Response } from "express";
import { generateSlug, generateUniqueSlug } from "../../utils/slug";
import { ApiError } from "../../utils/error";
import redisService from "../../config/redis";
import logger from "../../utils/logger";

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories (including unpublished course counts)
 * @access  Private (Admin)
 */
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    logger.info("Admin fetching categories", {
      adminId: req.user?.id,
      page,
      limit,
    });

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

/**
 * @route   POST /api/admin/categories
 * @desc    Create a new category
 * @access  Private (Admin)
 */
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    logger.info("Admin creating category", {
      adminId: req.user?.id,
      name,
    });

    const slug = await generateUniqueSlug(name);

    // Check if category with this slug already exists
    // const existingCategory = await prisma.category.findUnique({
    //   where: { slug },
    // });

    // if (existingCategory) {
    //   logger.warn("Duplicate category creation attempt", { name });
    //   throw ApiError.badRequest("A category with this name already exists");
    // }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    logger.info("Category created", {
      adminId: req.user?.id,
      categoryId: category.id,
    });

    await redisService.del("categories:all");

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  }
);

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update a category
 * @access  Private (Admin)
 */
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    logger.info("Admin updating category", {
      adminId: req.user?.id,
      categoryId: id,
    });

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw ApiError.notFound("Category not found");
    }

    // Generate new slug if name changed
    const slug = name ? await generateUniqueSlug(name) : existingCategory.slug;

    // Check if new slug conflicts with another category
    // if (slug !== existingCategory.slug) {
    //   const conflictingCategory = await prisma.category.findUnique({
    //     where: { slug },
    //   });

    //   if (conflictingCategory) {
    //     logger.warn("Slug conflict during update", {
    //       categoryId: id,
    //       slug,
    //     });
    //     throw ApiError.badRequest("A category with this name already exists");
    //   }
    // }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

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

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete a category
 * @access  Private (Admin)
 */
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    logger.info("Admin deleting category", {
      adminId: req.user?.id,
      categoryId: id,
    });

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

    /////Prevent deletion if courses are in the cateory
    if (category._count.courses > 0) {
      logger.warn("Blocked category deletion due to existing courses", {
        categoryId: id,
        courseCount: category._count.courses,
      });
      throw ApiError.badRequest(
        `Cannot delete category with ${category._count.courses} courses. Please move or delete the courses first.`
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    logger.info("Category deleted successfully", {
      categoryId: id,
      adminId: req.user?.id,
    });

    await redisService.del("categories:all");
    await redisService.del(`category:${category.slug}`);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
);
