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

router.get("/", getInstructorCourses);
router.post("/", upload.single("thumbnail"), createCourse);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

router.patch("/:id/publish", publishCourse);
router.patch("/:id/unpublish", unpublishCourse);

router.get("/:id/analytics", getCourseAnalytics);

export default router;
