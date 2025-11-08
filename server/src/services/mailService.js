import { transporter } from "../config/mailer.js";

export const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"CEMS" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
