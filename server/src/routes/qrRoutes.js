import express from "express";
import { verifyQR } from "../controllers/qrController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/verify", protect, requireRole("organizer", "admin"), verifyQR);

export default router;
