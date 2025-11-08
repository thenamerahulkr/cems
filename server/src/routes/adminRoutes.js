import express from "express";
import { getStats, getAllUsers, deleteUser } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, requireRole("admin"), getStats);
router.get("/users", protect, requireRole("admin"), getAllUsers);
router.delete("/users/:id", protect, requireRole("admin"), deleteUser);

export default router;
