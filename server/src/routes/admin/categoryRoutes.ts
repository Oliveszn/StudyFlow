/**
 * @swagger
 * tags:
 *   name: AdminCategories
 *   description: Admin category endpoints
 */
import { Router } from "express";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../controller/admin/categoryController";
import { authorize, requireAuth } from "../../middleware/auth";

const router = Router();

router.use(requireAuth);
router.use(authorize(["ADMIN"]));

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Get all categories (admin)
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of categories with admin fields
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post("/", createCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put("/:id", updateCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete("/:id", deleteCategory);

export default router;
