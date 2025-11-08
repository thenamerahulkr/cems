import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create payment order (for students)
router.post("/create-order", protect, createOrder);

// Verify payment after Razorpay checkout
router.post("/verify", protect, verifyPayment);

// Get payment details
router.get("/payment/:paymentId", protect, getPaymentDetails);

// Refund payment (admin/organizer only)
router.post("/refund", protect, requireRole("admin", "organizer"), refundPayment);

export default router;
