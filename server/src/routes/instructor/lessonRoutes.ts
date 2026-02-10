/**
 * @swagger
 * tags:
 *   name: Instructor Lessons
 *   description: Course lesson management for instructors
 */
import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  addAttachment,
  attachLessonVideo,
  createLesson,
  deleteAttachment,
  deleteLesson,
  generateVideoUploadUrl,
  getLesson,
  reorderLessons,
  updateLesson,
} from "../../controller/Instructor/lessonController";
import multer from "multer";

const upload = multer();
const router = express.Router();
router.use(requireAuth);
router.use(authorize(["INSTRUCTOR", "ADMIN"]));

/**
 * @swagger
 * /instructor/sections/{sectionId}/lessons:
 *   post:
 *     tags:
 *       - Instructor Lessons
 *     summary: Create a new lesson
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [VIDEO, ARTICLE]
 *               articleContent:
 *                 type: string
 *                 description: Required when type is ARTICLE
 *               isFree:
 *                 type: boolean
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Required when type is VIDEO
 *     responses:
 *       201:
 *         description: Lesson created successfully
 */
router.post("/sections/:sectionId/lessons", createLesson);

/**
 * @swagger
 * /instructor/lessons/{id}:
 *   get:
 *     tags:
 *       - Instructor Lessons
 *     summary: Get lesson
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
 *         description: Success
 *
 *   put:
 *     tags:
 *       - Instructor Lessons
 *     summary: Update lesson
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *
 *   delete:
 *     tags:
 *       - Instructor Lessons
 *     summary: Delete lesson
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
 *         description: Deleted
 */
router.get("/lessons/:id", getLesson);
router.put("/lessons/:id", updateLesson);
router.delete("/lessons/:id", deleteLesson);

/**
 * @swagger
 * /instructor/sections/{sectionId}/lessons/reorder:
 *   patch:
 *     tags:
 *       - Instructor Lessons
 *     summary: Reorder lessons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonOrders
 *             properties:
 *               lessonOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lessonId:
 *                       type: string
 *                     order:
 *                       type: number
 *     responses:
 *       200:
 *         description: Reordered
 */
router.patch("/sections/:sectionId/lessons/reorder", reorderLessons);

/**
 * @swagger
 * /instructor/lessons/{id}/upload-video:
 *   post:
 *     tags:
 *       - Instructor Lessons
 *     summary: Generate video upload URL
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
 *             required:
 *               - fileName
 *               - fileType
 *             properties:
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL generated
 */
router.post("/lessons/:id/upload-video", generateVideoUploadUrl);

router.patch("/lessons/:lessonId/video", attachLessonVideo);
/**
 * @swagger
 * /instructor/lessons/{id}/attachments:
 *   post:
 *     tags:
 *       - Instructor Lessons
 *     summary: Add attachment
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
 *             required: [name, url, size]
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               size:
 *                 type: number
 *     responses:
 *       200:
 *         description: Added
 *
 * /instructor/lessons/{id}/attachments/{attachmentId}:
 *   delete:
 *     tags:
 *       - Instructor Lessons
 *     summary: Delete attachment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: attachmentId
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */

router.post("/lessons/:id/attachments", addAttachment);
router.delete("/lessons/:id/attachments/:attachmentId", deleteAttachment);

export default router;
