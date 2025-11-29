import { Router } from "express";

import {
  getCourses,
  getCourseBySlug,
  getCourseCurriculum,
  getCourseReviews,
  getFeaturedCourses,
  getTrendingCourses,
} from "../controller/courseController";

const router = Router();

router.get("/", getCourses);
router.get("/featured", getFeaturedCourses);
router.get("/trending", getTrendingCourses);
router.get("/:slug", getCourseBySlug);
router.get("/:slug/curriculum", getCourseCurriculum);
router.get("/:slug/reviews", getCourseReviews);

export default router;
