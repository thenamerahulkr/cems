import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Notification from "../models/Notification.js";

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

export const approveOrganizer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({ message: "User is not an organizer" });
    }

    // Create notification for the organizer
    await Notification.create({
      userId: user._id,
      message: "Your organizer account has been approved! You can now create and manage events.",
      type: "success",
    });

    // Send approval email with credentials
    try {
      const { sendMail } = await import("../services/mailService.js");
      await sendMail(
        user.email,
        "🎉 Your Organizer Account Has Been Approved!",
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${user.name},</h2>
              
              <p style="color: #555; line-height: 1.6;">
                Great news! Your organizer account has been <strong style="color: #10b981;">approved</strong> by our admin team.
              </p>
              
              <div style="background: white; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #333;">Your Login Credentials:</h3>
                <p style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</p>
                <p style="margin: 10px 0;"><strong>Password:</strong> <em>Your registered password</em></p>
              </div>
              
              <p style="color: #555; line-height: 1.6;">
                You can now login and start creating amazing events for your college community!
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 40px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block;
                          font-weight: bold;">
                  Login Now
                </a>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 5px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>🔒 Security Tip:</strong> We recommend changing your password after your first login.
                </p>
              </div>
              
              <h3 style="color: #333; margin-top: 30px;">What you can do now:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li>Create and publish events</li>
                <li>Manage event registrations</li>
                <li>Track attendance with QR codes</li>
                <li>Send automated reminders to attendees</li>
                <li>View event analytics and statistics</li>
              </ul>
              
              <p style="color: #555; line-height: 1.6; margin-top: 30px;">
                If you have any questions, feel free to reach out to our support team.
              </p>
              
              <p style="color: #555; line-height: 1.6;">
                Best regards,<br>
                <strong>CEMS Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>This is an automated email from CEMS. Please do not reply.</p>
            </div>
          </div>
        `
      );
      console.log("✅ Approval email sent to:", user.email);
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
      // Don't fail the approval if email fails
    }

    res.json({ message: "Organizer approved successfully", user });
  } catch (error) {
    console.error("Approve organizer error:", error);
    res.status(500).json({ message: "Failed to approve organizer", error: error.message });
  }
};

export const rejectOrganizer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({ message: "User is not an organizer" });
    }

    // Create notification for the organizer
    await Notification.create({
      userId: user._id,
      message: "Your organizer account application has been rejected. Please contact the administrator for more information.",
      type: "error",
    });

    res.json({ message: "Organizer rejected", user });
  } catch (error) {
    console.error("Reject organizer error:", error);
    res.status(500).json({ message: "Failed to reject organizer", error: error.message });
  }
};

export const getPendingOrganizers = async (req, res) => {
  try {
    const pendingOrganizers = await User.find({ 
      role: "organizer", 
      status: "pending" 
    }).select("-password").sort({ createdAt: -1 });

    console.log("📋 Pending Organizers Query Result:", {
      count: pendingOrganizers.length,
      organizers: pendingOrganizers.map(o => ({ name: o.name, email: o.email, status: o.status }))
    });

    res.json({ organizers: pendingOrganizers });
  } catch (error) {
    console.error("Get pending organizers error:", error);
    res.status(500).json({ message: "Failed to fetch pending organizers", error: error.message });
  }
};
