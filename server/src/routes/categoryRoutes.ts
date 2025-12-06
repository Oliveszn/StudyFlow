/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Public category endpoints
 */
import { Router } from "express";

import {
  getCategories,
  getCategoryBySlug,
  getCoursesByCategory,
} from "../controller/categoryController";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories (public)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories with published course count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       courseCount:
 *                         type: integer
 */
router.get("/", getCategories);

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Get a single category by slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Slug of the category
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     courseCount:
 *                       type: integer
 *       404:
 *         description: Category not found
 */
router.get("/:slug", getCategoryBySlug);

/**
 * @swagger
 * /categories/{slug}/courses:
 *   get:
 *     summary: Get courses inside a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Slug of the category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [popular, newest, price-low, price-high, rating]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Courses in category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/Category'
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       404:
 *         description: Category not found
 */
router.get("/:slug/courses", getCoursesByCategory);

export default router;
