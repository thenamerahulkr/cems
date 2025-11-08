import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
} from "../controllers/eventController.js";

import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Use optionalAuth to check user role if logged in
router.get("/", optionalAuth, getEvents);
router.get("/:id", optionalAuth, getEvent);

router.post("/", protect, requireRole("organizer", "admin"), createEvent);
router.put("/:id", protect, requireRole("organizer", "admin"), updateEvent);
router.delete("/:id", protect, requireRole("organizer", "admin"), deleteEvent);

router.post("/:id/approve", protect, requireRole("admin"), approveEvent);
router.post("/:id/reject", protect, requireRole("admin"), rejectEvent);

export default router;
