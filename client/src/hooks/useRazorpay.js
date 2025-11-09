import { useState } from "react";
import api from "../api/api";

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (eventId, eventTitle, amount, onSuccess, onFailure) => {
    setLoading(true);
    try {
      console.log("🔄 Creating payment order for event:", eventId);
      
      // Create order
      const { data } = await api.post("/payment/create-order", { eventId });
      console.log("✅ Order created:", data);

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        console.error("❌ Razorpay not loaded");
        setLoading(false);
        onFailure("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "CEMS",
        description: `Registration for ${eventTitle}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            console.log("💳 Payment successful, verifying...", response);
            // Verify payment
            const verifyData = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: data.registrationId,
            });

            if (verifyData.data.success) {
              console.log("✅ Payment verified");
              setLoading(false);
              onSuccess(verifyData.data);
            } else {
              console.error("❌ Payment verification failed");
              setLoading(false);
              onFailure("Payment verification failed");
            }
          } catch (error) {
            console.error("❌ Verification error:", error);
            setLoading(false);
            onFailure(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#667eea",
        },
        modal: {
          ondismiss: function () {
            console.log("⚠️ Payment cancelled by user");
            setLoading(false);
            onFailure("Payment cancelled by user");
          },
        },
      };

      console.log("🚀 Opening Razorpay checkout");
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment failed:", response.error);
        setLoading(false);
        onFailure(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (error) {
      console.error("❌ Payment initiation error:", error);
      console.error("Error details:", error.response?.data);
      setLoading(false);
      onFailure(error.response?.data?.message || "Failed to initiate payment");
    }
  };

  return { initiatePayment, loading };
};
