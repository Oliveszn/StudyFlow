import express from "express";
import { requireAuth } from "../middleware/auth";
import {
  editProfile,
  getProfile,
  getPublicInstructorProfile,
} from "../controller/userController";

const router = express.Router();
router.get("/profile", requireAuth, getProfile);
router.get("/public-profile/:id", getPublicInstructorProfile);
router.put("/edit", requireAuth, editProfile);
export default router;
