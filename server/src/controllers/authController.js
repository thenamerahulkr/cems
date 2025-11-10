import User from "../models/User.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { sendMail } from "../services/mailService.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Prevent admin registration via API
    if (role === "admin") {
      return res.status(403).json({ 
        message: "Admin accounts cannot be created through registration. Please contact system administrator." 
      });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Please provide name, email, and password" 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "An account with this email already exists" 
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "student",
      department,
    });



    // Notify admin if organizer registered
    if (user.role === "organizer") {
      try {
        const admins = await User.find({ role: "admin" });
        for (const admin of admins) {
          await Notification.create({
            userId: admin._id,
            message: `New organizer registration: ${user.name} (${user.email}) is waiting for approval.`,
            type: "info",
          });
        }
      } catch (notifError) {
        console.error("Failed to notify admins:", notifError);
      }
    }

    // Determine message based on role
    const message = user.role === "organizer" 
      ? "Registration successful! Your account is pending admin approval."
      : "Registered successfully";

    // Send welcome email (don't block registration if email fails)
    try {
      const emailContent = user.role === "organizer"
        ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to CEMS, ${name}!</h2>
            <p>Thank you for registering as an <strong>Event Organizer</strong>.</p>
            <p style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <strong>⏳ Account Pending Approval</strong><br/>
              Your organizer account is currently under review by our administrators. 
              You will receive an email notification once your account is approved.
            </p>
            <p>Once approved, you will be able to:</p>
            <ul>
              <li>Create and publish events</li>
              <li>Manage event registrations</li>
              <li>Track attendance with QR codes</li>
              <li>Send notifications to attendees</li>
            </ul>
            <p>Thank you for your patience!</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This is an automated email from CEMS. Please do not reply.
            </p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to CEMS, ${name}!</h2>
            <p>Thank you for registering with the College Event Management System.</p>
            <p>Your account has been created successfully as a <strong>Student</strong>.</p>
            <p>You can now:</p>
            <ul>
              <li>Browse and discover campus events</li>
              <li>Register for events with one click</li>
              <li>Get QR codes for event check-in</li>
              <li>Receive notifications and reminders</li>
            </ul>
            <p>Get started by exploring upcoming events!</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This is an automated email from CEMS. Please do not reply.
            </p>
          </div>
        `;
      
      await sendMail(email, "Welcome to CEMS!", emailContent);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue with registration even if email fails
    }

    // For organizers, don't send token - they need admin approval first
    if (user.role === "organizer") {
      return res.status(201).json({
        message,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          department: user.department,
        },
        requiresApproval: true,
      });
    }

    // For students, generate token and allow immediate login
    const token = generateToken(user._id);
    res.status(201).json({
      message,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle duplicate email error (MongoDB unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "An account with this email already exists" 
      });
    }
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(", ") 
      });
    }
    
    res.status(500).json({ 
      message: "Registration failed. Please try again later.", 
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide email and password" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check if organizer account is approved
    if (user.role === "organizer" && user.status !== "approved") {
      const statusMessages = {
        pending: "Your organizer account is pending admin approval. Please wait for approval before logging in.",
        rejected: "Your organizer account has been rejected. Please contact the administrator for more information."
      };
      
      return res.status(403).json({ 
        message: statusMessages[user.status] || "Your account is not active.",
        status: user.status
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
      },
      token,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Login error:", error);
    }
    res.status(500).json({ 
      message: "Login failed. Please try again later."
    });
  }
};
