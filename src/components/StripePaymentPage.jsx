import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { paymentAPI } from "../services/payments.js";

// ------------------
// Checkout Form
// ------------------

// ------------------
// Main Page
// ------------------
const StripePaymentPage = ({ orderId, total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Create PaymentIntent on backend
      const { data } = await paymentAPI.createStripeIntent(orderId);
      const { clientSecret, paymentIntentId } = data.output ?? data.data;

      // 2. Confirm payment with Stripe on frontend
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      // 3. Notify backend of success
      await paymentAPI.confirmStripe(orderId, paymentIntentId);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex-1">
      <h2 className="text-lg font-bold mb-1">Pay with Card (USD)</h2>
      <p className="text-gray-500 text-sm mb-4">Total: ${total}</p>
      <div className="border rounded-lg px-3 py-3 mb-4">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button
        onClick={handlePay}
        disabled={loading || !stripe}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${total}`}
      </button>
    </div>
  );
};

export default StripePaymentPage;
