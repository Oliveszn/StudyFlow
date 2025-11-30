import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  enrollInCourse,
  getEnrollmentDetails,
  getEnrollments,
} from "../../controller/student/enrollmentController";
const router = express.Router();
router.use(requireAuth);
router.use(authorize(["STUDENT"]));

router.get("/enrollments", getEnrollments);
router.post("/enrollments", enrollInCourse);
router.get("/enrollments/:id", getEnrollmentDetails);

export default router;
