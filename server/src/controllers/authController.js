import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { sendMail } from "../services/mailService.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

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

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email (don't block registration if email fails)
    try {
      await sendMail(
        email,
        "Welcome to CEMS!",
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to CEMS, ${name}!</h2>
            <p>Thank you for registering with the College Event Management System.</p>
            <p>Your account has been created successfully as a <strong>${role}</strong>.</p>
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
        `
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue with registration even if email fails
    }

    res.status(201).json({
      message: "Registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed. Please try again later.", 
      error: error.message 
    });
  }
};
