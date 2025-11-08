import express from "express";
import {
  registerForEvent,
  unregisterFromEvent,
  getParticipants,
  getMyRegistrations,
} from "../controllers/registrationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:id/register", protect, registerForEvent);
router.delete("/:id/unregister", protect, unregisterFromEvent);
router.get("/:id/participants", protect, requireRole("organizer", "admin"), getParticipants);
router.get("/my-events", protect, getMyRegistrations);

export default router;
