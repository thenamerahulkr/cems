import Event from "../models/Event.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizerId: req.user._id,
    });

    // Notify all admins about new event
    try {
      const admins = await User.find({ role: "admin" });
      for (const admin of admins) {
        await Notification.create({
          userId: admin._id,
          message: `New event "${event.title}" by ${req.user.name} is waiting for approval.`,
          type: "info",
        });
      }
    } catch (notifError) {
      console.error("Failed to notify admins:", notifError);
    }

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    // Role-based filtering:
    // - No user (public) or Students: Only approved events
    // - Organizers: Only approved events + their own events (any status)
    // - Admins: All events (or filter by status if provided)
    if (!req.user || req.user.role === "student") {
      filter.status = "approved";
    } else if (req.user.role === "organizer") {
      // Organizers see approved events OR their own events
      filter.$or = [
        { status: "approved" },
        { organizerId: req.user._id }
      ];
    } else if (req.user.role === "admin" && status) {
      filter.status = status;
    }

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(filter)
      .populate("organizerId", "name email")
      .sort({ date: 1 });

    res.json({ events });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizerId", "name email")
      .populate("participants", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Access control based on user role:
    // - No user (public) or Students: Only approved events
    // - Organizers: Their own events (any status) or approved events
    // - Admins: All events
    
    if (!req.user || req.user.role === "student") {
      // Public users and students can only view approved events
      if (event.status !== "approved") {
        return res.status(404).json({ 
          message: "Event not found" 
        });
      }
    } else if (req.user.role === "organizer") {
      // Organizers can view their own events (any status) or approved events
      if (
        event.status !== "approved" && 
        event.organizerId._id.toString() !== req.user._id.toString()
      ) {
        return res.status(404).json({ 
          message: "Event not found" 
        });
      }
    }
    // Admins can view all events (no restriction)

    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Failed to fetch event", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is organizer or admin
    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Failed to update event", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is organizer or admin
    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};

export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Notify organizer
    await Notification.create({
      userId: event.organizerId,
      message: `Your event "${event.title}" has been approved!`,
      type: "success",
    });

    res.json({
      message: "Event approved successfully",
      event,
    });
  } catch (error) {
    console.error("Approve event error:", error);
    res.status(500).json({ message: "Failed to approve event", error: error.message });
  }
};

export const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Notify organizer
    await Notification.create({
      userId: event.organizerId,
      message: `Your event "${event.title}" has been rejected.`,
      type: "error",
    });

    res.json({
      message: "Event rejected",
      event,
    });
  } catch (error) {
    console.error("Reject event error:", error);
    res.status(500).json({ message: "Failed to reject event", error: error.message });
  }
};
