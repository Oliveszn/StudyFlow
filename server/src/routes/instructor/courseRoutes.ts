/**
 * @swagger
 * tags:
 *   name: Instructor Courses
 *   description: Course management for instructors
 */
import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  createCourse,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
  getCourseAnalytics,
} from "../../controller/Instructor/courseController";
import multer from "multer";

const upload = multer();
const router = express.Router();
router.use(requireAuth);
router.use(authorize(["INSTRUCTOR", "ADMIN"]));

/**
 * @swagger
 * /instructor/courses:
 *   get:
 *     summary: Get all courses for the logged-in instructor
 *     tags: [Instructor Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [published, draft]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor courses fetched successfully
 */
router.get("/", getInstructorCourses);

/**
 * @swagger
 * /instructor/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Instructor Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               language:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               whatYouWillLearn:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
 */

router.post("/", upload.single("thumbnail"), createCourse);

/**
 * @swagger
 * /instructor/courses/{id}:
 *   get:
 *     summary: Get a single course by ID (Instructor only)
 *     tags: [Instructor Courses]
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
 *         description: Course fetched successfully
 *       404:
 *         description: Course not found or unauthorized
 */

router.get("/:id", getCourseById);

/**
 * @swagger
 * /instructor/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Instructor Courses]
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
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               language:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               whatYouWillLearn:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found or unauthorized
 */

router.put("/:id", upload.single("thumbnail"), updateCourse);

/**
 * @swagger
 * /instructor/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Instructor Courses]
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
 *         description: Course deleted successfully
 *       400:
 *         description: Course has enrollments
 *       404:
 *         description: Course not found or unauthorized
 */
router.delete("/:id", deleteCourse);

/**
 * @swagger
 * /instructor/courses/{id}/publish:
 *   patch:
 *     summary: Publish a course
 *     tags: [Instructor Courses]
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
 *         description: Course published successfully
 *       400:
 *         description: Validation error before publishing
 *       404:
 *         description: Course not found
 */
router.patch("/:id/publish", publishCourse);

/**
 * @swagger
 * /instructor/courses/{id}/unpublish:
 *   patch:
 *     summary: Unpublish a course
 *     tags: [Instructor Courses]
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
 *         description: Course unpublished successfully
 *       404:
 *         description: Course not found
 */

router.patch("/:id/unpublish", unpublishCourse);

/**
 * @swagger
 * /instructor/courses/{id}/analytics:
 *   get:
 *     summary: Get analytics for a course
 *     tags: [Instructor Courses]
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
 *         description: Course analytics fetched successfully
 *       404:
 *         description: Course not found or unauthorized
 */
router.get("/:id/analytics", getCourseAnalytics);

export default router;
