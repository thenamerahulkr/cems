import { transporter } from "../config/mailer.js";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = async (to, subject, html) => {
  try {
    // Check if credentials are configured
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Email credentials not configured. Please check MAIL_USER and MAIL_PASS in .env file");
    }

    const info = await transporter.sendMail({
      from: `"CEMS" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log(`✅ Email sent to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    if (error.code === 'EAUTH') {
      console.error("   Authentication failed. Please check:");
      console.error("   1. MAIL_USER is correct:", process.env.MAIL_USER);
      console.error("   2. MAIL_PASS is a valid Gmail App Password (16 characters, no spaces)");
      console.error("   3. 2-Step Verification is enabled on your Google Account");
      console.error("   4. App Password is generated from: https://myaccount.google.com/apppasswords");
    }
    throw error;
  }
};
