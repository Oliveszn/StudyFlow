/**
 * @swagger
 * tags:
 *   name: Instructor Sections
 *   description: Course section management for instructors
 */
import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  createSection,
  deleteSection,
  getSection,
  reorderSections,
  updateSection,
} from "../../controller/Instructor/sectionController";
const router = express.Router();
router.use(requireAuth);
router.use(authorize(["INSTRUCTOR", "ADMIN"]));

/**
 * @swagger
 * /instructor/courses/{courseId}/sections:
 *   post:
 *     summary: Create a new section in a course
 *     tags: [Instructor Sections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction
 *               description:
 *                 type: string
 *                 example: Overview of the course
 *     responses:
 *       201:
 *         description: Section created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.post("/courses/:courseId/sections", createSection);

/**
 * @swagger
 * /instructor/sections/{id}:
 *   get:
 *     summary: Get single section with lessons
 *     tags: [Instructor Sections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section fetched successfully
 *       404:
 *         description: Section not found
 */
router.get("/sections/:id", getSection);

/**
 * @swagger
 * /instructor/sections/{id}:
 *   put:
 *     summary: Update a section
 *     tags: [Instructor Sections]
 *     security:
 *       - BearerAuth: []
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
 *               title:
 *                 type: string
 *                 example: Updated Section Title
 *               description:
 *                 type: string
 *                 example: Updated section description
 *     responses:
 *       200:
 *         description: Section updated successfully
 *       404:
 *         description: Section not found
 */
router.put("/sections/:id", updateSection);

/**
 * @swagger
 * /instructor/sections/{id}:
 *   delete:
 *     summary: Delete a section
 *     tags: [Instructor Sections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section deleted successfully
 *       400:
 *         description: Cannot delete section with lessons
 *       404:
 *         description: Section not found
 */
router.delete("/sections/:id", deleteSection);

/**
 * @swagger
 * /instructor/courses/{courseId}/sections/reorder:
 *   patch:
 *     summary: Reorder sections in a course
 *     tags: [Instructor Sections]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sectionOrders]
 *             properties:
 *               sectionOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [sectionId, order]
 *                   properties:
 *                     sectionId:
 *                       type: string
 *                       example: sec_123
 *                     order:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Sections reordered successfully
 *       400:
 *         description: Invalid section IDs
 *       404:
 *         description: Course not found
 */
router.patch("/courses/:courseId/sections/reorder", reorderSections);

export default router;
