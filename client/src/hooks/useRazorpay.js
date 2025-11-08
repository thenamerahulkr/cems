import { useState } from "react";
import api from "../api/api";

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (eventId, eventTitle, amount, onSuccess, onFailure) => {
    setLoading(true);
    try {
      // Create order
      const { data } = await api.post("/payment/create-order", { eventId });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "CEMS",
        description: `Registration for ${eventTitle}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyData = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: data.registrationId,
            });

            if (verifyData.data.success) {
              setLoading(false);
              onSuccess(verifyData.data);
            } else {
              setLoading(false);
              onFailure("Payment verification failed");
            }
          } catch (error) {
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
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            onFailure("Payment cancelled by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setLoading(false);
        onFailure(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (error) {
      setLoading(false);
      onFailure(error.response?.data?.message || "Failed to initiate payment");
    }
  };

  return { initiatePayment, loading };
};
