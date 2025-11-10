import QRCode from "qrcode";

export const generateQR = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("QR generation failed:", error);
    }
    throw error;
  }
};
