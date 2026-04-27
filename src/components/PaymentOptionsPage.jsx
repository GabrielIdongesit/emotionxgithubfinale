import { useSearchParams, useNavigate } from "react-router-dom";
import StripePaymentPage from "./StripePaymentPage";
import BitcoinPaymentPage from "./BitcoinPaymentPage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentOptionsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total") || "0.00";

  const onSuccess = () => {
    navigate("/order-success");
  };

  if (!orderId) {
    return (
      <div className="text-center py-20 text-red-500">
        Invalid order. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Choose Payment Method
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Elements stripe={stripePromise}>
          <StripePaymentPage
            orderId={orderId}
            total={total}
            onSuccess={onSuccess}
          />
        </Elements>
        <BitcoinPaymentPage
          orderId={orderId}
          total={total}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

export default PaymentOptionsPage;
