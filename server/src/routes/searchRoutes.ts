import {
  getSearchSuggestions,
  globalSearch,
  searchCourses,
  searchInstructors,
} from "../controller/searchController";
import express from "express";
const router = express.Router();
router.get("/", globalSearch);

router.get("/courses", searchCourses);
router.get("/instructors", searchInstructors);

router.get("/suggestions", getSearchSuggestions);

export default router;
