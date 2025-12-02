import { Router } from "express";
import {
  getTransactionDetails,
  getTransactionHistory,
  initializePayment,
  paystackWebhook,
  verifyPayment,
} from "../controller/paymentController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/initialize", requireAuth, initializePayment);

router.get("/verify/:reference", requireAuth, verifyPayment);

router.post("/webhook/paystack", paystackWebhook);

router.get("/transactions", requireAuth, getTransactionHistory);
router.get("/transactions/:id", requireAuth, getTransactionDetails);

export default router;
