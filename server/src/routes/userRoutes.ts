import express from "express";
import { requireAuth } from "../middleware/auth";
import {
  changePassword,
  deleteAccount,
  editProfile,
  getProfile,
  getPublicInstructorProfile,
} from "../controller/userController";

const router = express.Router();
router.get("/profile", requireAuth, getProfile);
router.get("/public-profile/:id", getPublicInstructorProfile);
router.put("/edit", requireAuth, editProfile);
router.delete("/delete", requireAuth, deleteAccount);
router.patch("/change-password", requireAuth, changePassword);
export default router;
