import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

export const getStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalEvents: await Event.countDocuments(),
      totalRegistrations: await Registration.countDocuments(),
      pendingEvents: await Event.countDocuments({ status: "pending" }),
      approvedEvents: await Event.countDocuments({ status: "approved" }),
      studentCount: await User.countDocuments({ role: "student" }),
      organizerCount: await User.countDocuments({ role: "organizer" }),
    };

    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};
