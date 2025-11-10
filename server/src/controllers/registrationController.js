import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import { generateQR } from "../services/qrService.js";
import { sendMail } from "../services/mailService.js";

export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is approved
    if (event.status !== "approved") {
      return res.status(400).json({ message: "Event is not approved yet" });
    }

    // Check if event is paid - redirect to payment flow
    if (event.isPaid && event.price > 0) {
      return res.status(400).json({ 
        message: "This is a paid event. Please use the payment flow.",
        isPaid: true,
        price: event.price
      });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({ eventId: id, userId });
    if (existingReg) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Check capacity
    if (event.participants.length >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Generate QR code
    const qrData = { eventId: id, userId: userId.toString(), timestamp: Date.now() };
    const qrCode = await generateQR(qrData);

    // Create registration (free event)
    await Registration.create({
      eventId: id,
      userId,
      qrCode,
      paymentStatus: "completed", // Free events are automatically completed
      amount: 0,
    });

    // Add participant to event
    await Event.findByIdAndUpdate(id, { $push: { participants: userId } });

    // Create notification for student
    await Notification.create({
      userId,
      message: `You have successfully registered for "${event.title}"`,
      type: "success",
    });

    // Notify organizer about new registration
    try {
      await Notification.create({
        userId: event.organizerId,
        message: `${req.user.name} registered for your event "${event.title}"`,
        type: "info",
      });
    } catch (notifError) {
      // Continue silently
    }

    // Send confirmation email with QR code (don't block registration if email fails)
    try {
      await sendMail(
        req.user.email,
        `Registration Confirmed: ${event.title}`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Registration Confirmed!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${req.user.name},</h2>
              
              <p style="color: #555; line-height: 1.6;">
                You have successfully registered for <strong>${event.title}</strong>.
              </p>
              
              <div style="background: white; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #333;">Event Details:</h3>
                <p style="margin: 10px 0;"><strong>Event:</strong> ${event.title}</p>
                <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()} at ${new Date(event.date).toLocaleTimeString()}</p>
                <p style="margin: 10px 0;"><strong>Venue:</strong> ${event.venue}</p>
              </div>

              <div style="background: white; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center;">
                <h3 style="color: #333; margin-top: 0;">Your QR Code</h3>
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                  Show this QR code at the event entrance for check-in
                </p>
                <img src="${qrCode}" alt="Event QR Code" style="max-width: 250px; height: auto; border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px;" />
                <p style="color: #666; font-size: 12px; margin-top: 15px;">
                  You can also access this QR code anytime from your registered events page.
                </p>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 5px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Reminder:</strong> We'll send you a reminder 24 hours before the event.
                </p>
              </div>
              
              <p style="color: #555; line-height: 1.6;">
                Looking forward to seeing you at the event!
              </p>
              
              <p style="color: #555; line-height: 1.6;">
                Best regards,<br>
                <strong>CEMS Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>This is an automated email from CEMS. Please do not reply.</p>
            </div>
          </div>
        `
      );
    } catch (emailError) {
      // Continue with registration even if email fails
    }

    res.json({
      message: "Registered successfully",
      qrCode,
    });
  } catch (error) {
    
    // Handle duplicate registration error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "You are already registered for this event" 
      });
    }
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: messages 
      });
    }
    
    res.status(500).json({ 
      message: "Registration failed. Please try again.", 
      error: error.message 
    });
  }
};

export const unregisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Delete registration
    const registration = await Registration.findOneAndDelete({ eventId: id, userId });
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Remove participant from event
    await Event.findByIdAndUpdate(id, { $pull: { participants: userId } });

    res.json({ message: "Unregistered successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to unregister. Please try again."
    });
  }
};

export const getParticipants = async (req, res) => {
  try {
    const regs = await Registration.find({ eventId: req.params.id })
      .populate("userId", "name email department")
      .sort({ createdAt: -1 });

    res.json({ participants: regs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch participants" });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate("eventId")
      .sort({ createdAt: -1 });

    // Filter out registrations where event was deleted
    const events = registrations
      .filter((reg) => reg.eventId) // Only include if event exists
      .map((reg) => ({
        ...reg.eventId.toObject(),
        qrCode: reg.qrCode,
        registrationId: reg._id,
        paymentStatus: reg.paymentStatus,
        amount: reg.amount,
      }));

    res.json({ events, registrations });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch your registrations. Please try again."
    });
  }
};
