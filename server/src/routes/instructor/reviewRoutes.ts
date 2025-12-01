import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  getCourseReviews,
  getReviewStats,
} from "../../controller/Instructor/reviewController";

const router = express.Router();
router.use(requireAuth);
router.use(authorize(["INSTRUCTOR", "ADMIN"]));

router.get("/courses/:courseId/reviews", getCourseReviews);
router.get("/courses/:courseId/reviews/stats", getReviewStats);

export default router;
