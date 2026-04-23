import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateItem, removeItem, loading } = useCart();

  // cart from context is { items: [], total: 0 }
  // Each item has: _id, product: { name, image }, quantity, price
  const items = Array.isArray(cart?.items) ? cart.items : [];

  const total = items.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
  }, 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Your Cart</h2>

      {items.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link to="/" className="text-teal-600 underline">
            Click here to add bikes
          </Link>
        </p>
      ) : (
        <div className="bg-white p-4 shadow rounded">
          {items.map((item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            // product name/image comes from populated .product field
            const name = item.product?.name || item.name || "Product";
            const image =
              item.product?.image || item.image || "/placeholder-bike.png";

            return (
              <div
                key={item._id}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={image}
                    alt={name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/placeholder-bike.png";
                    }}
                  />
                  <p className="font-semibold">{name}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItem(item._id, qty - 1)}
                    disabled={qty <= 1}
                    className="disabled:opacity-40"
                  >
                    <AiOutlineMinus />
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => updateItem(item._id, qty + 1)}>
                    <AiOutlinePlus />
                  </button>
                </div>

                <p className="font-bold">${(price * qty).toFixed(2)}</p>

                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <BsFillTrashFill />
                </button>
              </div>
            );
          })}

          <hr className="my-4" />

          <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>

          <Link
            to="/checkout"
            className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
