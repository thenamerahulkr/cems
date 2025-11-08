import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startCronJobs } from "./services/cronService.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Start cron jobs
startCronJobs();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
});
