import express from "express";
import { 
  getStats, 
  getAllUsers, 
  deleteUser, 
  approveOrganizer, 
  rejectOrganizer, 
  getPendingOrganizers 
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, requireRole("admin"), getStats);
router.get("/users", protect, requireRole("admin"), getAllUsers);
router.delete("/users/:id", protect, requireRole("admin"), deleteUser);

// Organizer approval routes
router.get("/pending-organizers", protect, requireRole("admin"), getPendingOrganizers);
router.post("/organizers/:id/approve", protect, requireRole("admin"), approveOrganizer);
router.post("/organizers/:id/reject", protect, requireRole("admin"), rejectOrganizer);

export default router;
