import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startCronJobs } from "./services/cronService.js";
import { initializeAdmin } from "./utils/initAdmin.js";

// Load environment variables
dotenv.config();

// Connect to database and initialize admin
connectDB().then(() => {
  // Initialize admin user after DB connection
  initializeAdmin();
});

// Start cron jobs
startCronJobs();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
  }
});
