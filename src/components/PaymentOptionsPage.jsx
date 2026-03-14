import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StripePaymentPage from "./StripePaymentPage";
import BitcoinPaymentPage from "./BitcoinPaymentPage";

const PaymentOptionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const totalAmount = location.state?.totalAmount;

  if (!totalAmount) {
    return (
      <div className="text-center mt-10">
        <h2>No order found</h2>
        <button
          onClick={() => navigate("/cart")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        Choose Payment Method
      </h2>

      {/* Side-by-side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Stripe */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <StripePaymentPage totalAmount={totalAmount} />
        </div>

        {/* Bitcoin */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <BitcoinPaymentPage totalAmount={totalAmount} />
        </div>

      </div>
    </div>
  );
};

export default PaymentOptionsPage;
