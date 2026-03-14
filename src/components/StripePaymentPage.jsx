import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_your_publishable_key_here");

// ------------------
// Checkout Form
// ------------------
const CheckoutForm = ({ totalAmount }) => {
const stripe = useStripe();
// const elements = useElements();
// const navigate = useNavigate();
const [email, setEmail] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();

```
if (!stripe || !elements) return;

// Simulated success (frontend only)
alert("Payment successful ✅");
navigate("/success");
```

};

return ( <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow"> <h2 className="text-xl font-bold mb-4">Pay with Card (USD)</h2>

  <p className="mb-4 font-semibold">
    Total: ${totalAmount.toFixed(2)}
  </p>

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-2 border rounded mb-3"
    required
  />

  <div className="border p-2 rounded mb-3">
    <CardElement />
  </div>

  <button
    type="submit"
    disabled={!stripe}
    className="w-full bg-blue-600 text-white py-2 rounded"
  >
    Pay ${totalAmount.toFixed(2)}
  </button>
</form>


);
};

// ------------------
// Main Page
// ------------------
const StripePaymentPage = () => {
const location = useLocation();
const navigate = useNavigate();

const totalAmount = location.state?.totalAmount;

if (!totalAmount) {
return ( <div className="text-center mt-10"> <h2>No order found</h2>
<button
onClick={() => navigate("/cart")}
className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
>
Back to Cart </button> </div>
);
}

return ( <Elements stripe={stripePromise}> <CheckoutForm totalAmount={totalAmount} /> </Elements>
);
};

export default StripePaymentPage;
