import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  getCourseProgress,
  getLesson,
  getLessonVideoUrl,
  getStudentDashboard,
  markLessonComplete,
  updateVideoProgress,
} from "../../controller/student/progressController";
const router = express.Router();
router.use(requireAuth);
router.use(authorize(["STUDENT"]));

router.get("/courses/:courseId/progress", getCourseProgress);
router.get("/lessons/:lessonId", getLesson);
router.get("/lessons/:lessonId/video-url", getLessonVideoUrl);
router.post("/lessons/:lessonId/complete", markLessonComplete);
router.put("/lessons/:lessonId/progress", updateVideoProgress);

// Dashboard
router.get("/dashboard", getStudentDashboard);

export default router;
