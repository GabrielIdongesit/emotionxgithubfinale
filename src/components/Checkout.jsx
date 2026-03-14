import React from "react";
import { useNavigate } from "react-router-dom";

const Checkout = ({ cart, setCart }) => {
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Navigate to payment page and pass total
    navigate("/PaymentOptionsPage", {
      state: {
        totalAmount: total,
        cartItems: cart
      }
    });

//     navigate("/bitcoin-payment", {
//   state: { totalAmount: total }
// });

  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Checkout</h2>

      <div className="bg-white p-4 shadow rounded">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <p>{item.name} x {item.qty}</p>
            <p>${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}

        <hr className="my-4"/>

        <h3 className="text-xl font-bold">
          Total Payment: ${total.toFixed(2)}
        </h3>

        <button
          // type="button"
          onClick={handlePlaceOrder}
          className="mt-4 bg-green-500 text-white w-full py-2 rounded"
        >
          Place Order
        </button>

      </div>
    </div>
  );
};

export default Checkout;
