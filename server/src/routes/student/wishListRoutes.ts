import express from "express";
import { requireAuth, authorize } from "../../middleware/auth";
import {
  addToWishlist,
  checkInWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../controller/student/wishlistController";
const router = express.Router();
router.use(requireAuth);
router.use(authorize(["STUDENT"]));

router.get("/wishlist", getWishlist);
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:courseId", removeFromWishlist);
router.get("/wishlist/check/:courseId", checkInWishlist);
router.delete("/wishlist", clearWishlist);

export default router;
