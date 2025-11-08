import QRCode from "qrcode";

export const generateQR = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data));
  } catch (error) {
    console.error("QR generation failed:", error);
    throw error;
  }
};
