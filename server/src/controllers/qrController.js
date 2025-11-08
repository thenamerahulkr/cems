import Registration from "../models/Registration.js";

export const verifyQR = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const reg = await Registration.findOne({ eventId, userId });
    
    if (!reg) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    if (reg.verified) {
      return res.status(400).json({ message: "Already checked in" });
    }

    reg.verified = true;
    await reg.save();

    res.json({
      message: "Participant checked in successfully",
      registration: reg,
    });
  } catch (error) {
    console.error("QR verification error:", error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};
