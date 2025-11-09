import { razorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import { generateQR } from "../services/qrService.js";
import { sendMail } from "../services/mailService.js";

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    console.log("📝 Create order request received:", req.body);
    const { eventId } = req.body;
    const userId = req.user._id;

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      console.error("❌ Event not found:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("✅ Event found:", event.title, "Price:", event.price);

    // Check if event is approved
    if (event.status !== "approved") {
      console.error("❌ Event not approved:", event.status);
      return res.status(400).json({ message: "Event is not approved yet" });
    }

    // Check if event is paid
    if (!event.isPaid || event.price === 0) {
      console.error("❌ Event is free");
      return res.status(400).json({ message: "This is a free event. Use regular registration." });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({ eventId, userId });
    if (existingReg && existingReg.paymentStatus === "completed") {
      console.error("❌ Already registered");
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Check capacity
    if (event.participants.length >= event.capacity) {
      console.error("❌ Event full");
      return res.status(400).json({ message: "Event is full" });
    }

    // Create Razorpay order
    const options = {
      amount: event.price * 100, // Amount in paise (₹100 = 10000 paise)
      currency: "INR",
      receipt: `receipt_${eventId}_${userId}_${Date.now()}`,
      notes: {
        eventId: eventId.toString(),
        userId: userId.toString(),
        eventTitle: event.title,
        userName: req.user.name,
      },
    };

    console.log("💳 Creating Razorpay order with options:", options);
    
    // Check if razorpayInstance is initialized
    if (!razorpayInstance) {
      console.error("❌ Razorpay instance not initialized");
      return res.status(500).json({ message: "Payment gateway not configured" });
    }

    let order;
    try {
      order = await razorpayInstance.orders.create(options);
      console.log("✅ Razorpay order created:", order.id);
    } catch (razorpayError) {
      console.error("❌ Razorpay API error:", razorpayError);
      console.error("Error details:", razorpayError.error);
      return res.status(500).json({ 
        message: "Failed to create payment order", 
        error: razorpayError.error?.description || razorpayError.message 
      });
    }

    // Create or update pending registration
    let registration;
    if (existingReg) {
      registration = await Registration.findByIdAndUpdate(
        existingReg._id,
        {
          paymentStatus: "pending",
          orderId: order.id,
          amount: event.price,
        },
        { new: true }
      );
    } else {
      registration = await Registration.create({
        eventId,
        userId,
        paymentStatus: "pending",
        orderId: order.id,
        amount: event.price,
      });
    }

    console.log(`✅ Payment order created: ${order.id} for event: ${event.title}`);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      registrationId: registration._id,
      eventTitle: event.title,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      const registration = await Registration.findById(registrationId).populate("eventId");

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      // Update registration with payment details
      registration.paymentStatus = "completed";
      registration.paymentId = razorpay_payment_id;

      // Generate QR code
      const qrData = {
        eventId: registration.eventId._id,
        userId: registration.userId,
        registrationId: registration._id,
        timestamp: Date.now(),
      };
      const qrCode = await generateQR(qrData);
      registration.qrCode = qrCode;
      await registration.save();

      // Add participant to event
      await Event.findByIdAndUpdate(registration.eventId._id, {
        $addToSet: { participants: registration.userId },
      });

      // Create notification for student
      await Notification.create({
        userId: registration.userId,
        message: `Payment successful! You are registered for "${registration.eventId.title}"`,
        type: "success",
      });

      // Notify organizer about paid registration
      try {
        await Notification.create({
          userId: registration.eventId.organizerId,
          message: `${req.user.name} paid ₹${registration.amount} and registered for "${registration.eventId.title}"`,
          type: "success",
        });
      } catch (notifError) {
        console.error("Failed to notify organizer:", notifError);
      }

      // Send confirmation email
      try {
        await sendMail(
          req.user.email,
          `Payment Successful - ${registration.eventId.title}`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #22c55e;">✅ Payment Successful!</h2>
              <p>Hi ${req.user.name},</p>
              <p>Your payment has been processed successfully and you are now registered for:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Event:</strong> ${registration.eventId.title}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(registration.eventId.date).toLocaleDateString()}</p>
                <p style="margin: 5px 0;"><strong>Venue:</strong> ${registration.eventId.venue}</p>
                <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${registration.amount}</p>
                <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
              </div>
              <p>Your QR code has been generated. You can view it in your registered events.</p>
              <p>We'll send you a reminder 24 hours before the event.</p>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                This is an automated email from CEMS. Please do not reply.
              </p>
            </div>
          `
        );
      } catch (emailError) {
        console.error("Failed to send payment confirmation email:", emailError);
      }

      console.log(`✅ Payment verified: ${razorpay_payment_id} for registration: ${registrationId}`);

      res.json({
        success: true,
        message: "Payment verified successfully",
        registration: {
          _id: registration._id,
          qrCode: registration.qrCode,
          paymentId: registration.paymentId,
          amount: registration.amount,
        },
      });
    } else {
      // Invalid signature
      await Registration.findByIdAndUpdate(registrationId, {
        paymentStatus: "failed",
      });

      console.error(`❌ Payment verification failed for registration: ${registrationId}`);

      res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpayInstance.payments.fetch(paymentId);

    res.json({ payment });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ message: "Failed to fetch payment details", error: error.message });
  }
};

// Refund payment
export const refundPayment = async (req, res) => {
  try {
    const { registrationId } = req.body;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.paymentStatus !== "completed") {
      return res.status(400).json({ message: "No completed payment to refund" });
    }

    // Create refund
    const refund = await razorpayInstance.payments.refund(registration.paymentId, {
      amount: registration.amount * 100, // Amount in paise
    });

    // Update registration
    registration.paymentStatus = "refunded";
    await registration.save();

    // Remove from event participants
    await Event.findByIdAndUpdate(registration.eventId, {
      $pull: { participants: registration.userId },
    });

    console.log(`✅ Refund processed: ${refund.id} for registration: ${registrationId}`);

    res.json({
      success: true,
      message: "Refund processed successfully",
      refund,
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ message: "Refund failed", error: error.message });
  }
};
