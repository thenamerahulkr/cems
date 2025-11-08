import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import { generateQR } from "../services/qrService.js";

export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is approved
    if (event.status !== "approved") {
      return res.status(400).json({ message: "Event is not approved yet" });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({ eventId: id, userId });
    if (existingReg) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Check capacity
    if (event.participants.length >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Generate QR code
    const qrData = { eventId: id, userId: userId.toString(), timestamp: Date.now() };
    const qrCode = await generateQR(qrData);

    // Create registration
    await Registration.create({
      eventId: id,
      userId,
      qrCode,
    });

    // Add participant to event
    await Event.findByIdAndUpdate(id, { $push: { participants: userId } });

    // Create notification
    await Notification.create({
      userId,
      message: `You have successfully registered for "${event.title}"`,
      type: "success",
    });

    res.json({
      message: "Registered successfully",
      qrCode,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const unregisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Delete registration
    const registration = await Registration.findOneAndDelete({ eventId: id, userId });
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Remove participant from event
    await Event.findByIdAndUpdate(id, { $pull: { participants: userId } });

    res.json({ message: "Unregistered successfully" });
  } catch (error) {
    console.error("Unregistration error:", error);
    res.status(500).json({ message: "Unregistration failed", error: error.message });
  }
};

export const getParticipants = async (req, res) => {
  try {
    const regs = await Registration.find({ eventId: req.params.id })
      .populate("userId", "name email department")
      .sort({ createdAt: -1 });

    res.json({ participants: regs });
  } catch (error) {
    console.error("Get participants error:", error);
    res.status(500).json({ message: "Failed to fetch participants", error: error.message });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate("eventId")
      .sort({ createdAt: -1 });

    const events = registrations.map((reg) => reg.eventId);

    res.json({ events });
  } catch (error) {
    console.error("Get my registrations error:", error);
    res.status(500).json({ message: "Failed to fetch registrations", error: error.message });
  }
};
