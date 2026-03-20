import { Router } from "express";
import {
  getTransactionDetails,
  getTransactionHistory,
  initializePayment,
  paystackWebhook,
  verifyPayment,
} from "../controller/paymentController";
import { requireAuth } from "../middleware/auth";
import { paymentLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/initialize", requireAuth, paymentLimiter, initializePayment);

router.get("/verify/:reference", requireAuth, paymentLimiter, verifyPayment);

router.post("/webhook/paystack", paymentLimiter, paystackWebhook);

router.get("/transactions", requireAuth, paymentLimiter, getTransactionHistory);
router.get(
  "/transactions/:id",
  requireAuth,
  paymentLimiter,
  getTransactionDetails,
);

export default router;
