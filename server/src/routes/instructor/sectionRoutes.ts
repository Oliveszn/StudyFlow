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

router.post("/courses/:courseId/sections", createSection);
router.get("/sections/:id", getSection);
router.put("/sections/:id", updateSection);
router.delete("/sections/:id", deleteSection);

router.patch("/courses/:courseId/sections/reorder", reorderSections);

export default router;
