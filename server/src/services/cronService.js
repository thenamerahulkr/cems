import cron from "node-cron";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { sendMail } from "./mailService.js";

export const startCronJobs = () => {
  // Run every day at 9 AM
  cron.schedule("0 9 * * *", async () => {
    try {
      console.log("🕒 Running daily event reminder job...");
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const upcoming = await Event.find({
        date: { $gte: tomorrow, $lt: dayAfterTomorrow },
        status: "approved",
      }).populate("participants");

      for (let event of upcoming) {
        for (let userId of event.participants) {
          const user = await User.findById(userId);
          if (user) {
            await sendMail(
              user.email,
              `Reminder: ${event.title}`,
              `
                <h2>Event Reminder</h2>
                <p>Hi ${user.name},</p>
                <p>This is a reminder that <strong>${event.title}</strong> is tomorrow!</p>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Venue:</strong> ${event.venue}</p>
                <p>See you there!</p>
              `
            );
          }
        }
      }
      
      console.log(`✅ Sent reminders for ${upcoming.length} events`);
    } catch (error) {
      console.error("❌ Cron job failed:", error);
    }
  });

  console.log("✅ Cron jobs started");
};
