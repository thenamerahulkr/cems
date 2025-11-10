import { transporter } from "../config/mailer.js";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = async (to, subject, html) => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Email credentials not configured");
    }

    const info = await transporter.sendMail({
      from: `"CEMS" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    return info;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Email sending failed:", error.message);
      if (error.code === 'EAUTH') {
        console.error("Authentication failed. Check MAIL_USER and MAIL_PASS in .env file");
      }
    }
    throw error;
  }
};
