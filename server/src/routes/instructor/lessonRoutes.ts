import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  addAttachment,
  createLesson,
  deleteAttachment,
  deleteLesson,
  generateVideoUploadUrl,
  getLesson,
  reorderLessons,
  updateLesson,
} from "../../controller/Instructor/lessonController";

const router = express.Router();
router.use(requireAuth);
router.use(authorize(["INSTRUCTOR", "ADMIN"]));

router.post("/sections/:sectionId/lessons", createLesson);
router.get("/lessons/:id", getLesson);
router.put("/lessons/:id", updateLesson);
router.delete("/lessons/:id", deleteLesson);

router.patch("/sections/:sectionId/lessons/reorder", reorderLessons);

router.post("/lessons/:id/upload-video", generateVideoUploadUrl);

router.post("/lessons/:id/attachments", addAttachment);
router.delete("/lessons/:id/attachments/:attachmentId", deleteAttachment);

export default router;
