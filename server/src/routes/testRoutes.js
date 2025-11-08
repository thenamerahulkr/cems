import express from "express";
import { sendMail } from "../services/mailService.js";

const router = express.Router();

// Test email endpoint
router.post("/send-test-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to) {
      return res.status(400).json({ message: "Email address is required" });
    }

    await sendMail(
      to,
      subject || "Test Email from CEMS",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>${message || "This is a test email from the CEMS mail service."}</p>
          <p>If you received this email, the mail service is working correctly!</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    );

    res.json({ 
      success: true, 
      message: `Test email sent successfully to ${to}` 
    });
  } catch (error) {
    console.error("Test email failed:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send test email", 
      error: error.message 
    });
  }
});

export default router;
