// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../services/orders.js";

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [address, setAddress] = useState({ street: "", city: "", country: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await orderAPI.create({
        paymentMethod,
        deliveryType,
        shippingAddress: deliveryType === "delivery" ? address : undefined,
      });

      // Backend uses "output" key, not "data"
      const order = data.output ?? data.data ?? data;

      navigate(
        `/payment?orderId=${order._id}&method=${paymentMethod}&total=${order.totalAmount}`,
      );
    } catch (err) {
      // Show the exact backend error message
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        {cart.items?.map((item) => (
          <div
            key={item._id}
            className="flex justify-between py-2 border-b last:border-0"
          >
            <span>
              {item.product?.name || item.name} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3 text-lg">
          <span>Total Payment:</span>
          <span>${cart.total?.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Type */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Delivery Option</label>
        <div className="flex gap-4">
          {["delivery", "pickup"].map((opt) => (
            <button
              key={opt}
              onClick={() => setDeliveryType(opt)}
              className={`px-4 py-2 rounded-lg border capitalize ${
                deliveryType === opt
                  ? "bg-green-500 text-white border-green-500"
                  : "border-gray-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      {deliveryType === "delivery" && (
        <div className="mb-4 space-y-2">
          <label className="block font-semibold mb-1">Shipping Address</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Country"
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
          />
        </div>
      )}

      {/* Payment Method */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Payment Method</label>
        <div className="flex gap-4">
          {["card", "bitcoin"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`px-4 py-2 rounded-lg border capitalize ${
                paymentMethod === method
                  ? "bg-green-500 text-white border-green-500"
                  : "border-gray-300"
              }`}
            >
              {method === "card" ? "💳 Card (USD)" : "₿ Bitcoin"}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={loading || cart.items?.length === 0}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
