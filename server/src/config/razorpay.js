import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Log configuration status (without exposing secrets)
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  console.log("✅ Razorpay configured successfully");
} else {
  console.warn("⚠️  Razorpay credentials not found in .env file");
}
