import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  createReview,
  deleteReview,
  getMyReviewForCourse,
  getMyReviews,
  updateReview,
} from "../../controller/student/reviewController";
const router = express.Router();
router.use(requireAuth);
router.use(authorize(["STUDENT"]));

router.get("/reviews", getMyReviews);
router.get("/courses/:courseId/my-review", getMyReviewForCourse);
router.post("/courses/:courseId/reviews", createReview);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

export default router;
