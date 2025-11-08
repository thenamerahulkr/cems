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

import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);

router.post("/", protect, requireRole("organizer", "admin"), createEvent);
router.put("/:id", protect, requireRole("organizer", "admin"), updateEvent);
router.delete("/:id", protect, requireRole("organizer", "admin"), deleteEvent);

router.post("/:id/approve", protect, requireRole("admin"), approveEvent);
router.post("/:id/reject", protect, requireRole("admin"), rejectEvent);

export default router;
