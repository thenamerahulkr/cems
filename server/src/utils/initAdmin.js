// Auto-initialize admin user on server start
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const initializeAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "System Administrator";

    // Validate environment variables
    if (!adminEmail || !adminPassword) {
      console.warn("⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env file");
      console.warn("⚠️  Admin user will not be created automatically");
      console.warn("⚠️  Run 'node createAdmin.js' to create admin manually");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      status: "approved"
    });

    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`👤 Name: ${adminName}`);
    console.log("🔐 Use the password from your .env file to login");
    
  } catch (error) {
    console.error("❌ Error initializing admin:", error.message);
  }
};
