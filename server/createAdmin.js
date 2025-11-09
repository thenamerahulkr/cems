// Script to create an admin user
// NOTE: This script is now OPTIONAL!
// Admin is auto-created on server start from .env variables
// Use this script only if you want to create admin manually

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  status: String,
  department: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@cems.com" });
    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@cems.com",
      password: hashedPassword,
      role: "admin",
      status: "approved",
      department: "Administration",
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@cems.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
