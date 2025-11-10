// Auto-initialize admin user on server start
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const initializeAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "System Administrator";

    if (!adminEmail || !adminPassword) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env file");
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      status: "approved"
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log("Admin user created successfully");
    }
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Error initializing admin:", error.message);
    }
  }
};
