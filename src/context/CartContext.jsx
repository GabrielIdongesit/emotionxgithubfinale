// src/context/CartContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartAPI } from "../services/cart.js";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch cart on login
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.add(productId, quantity);
      await fetchCart(); // Re-fetch to get updated cart
    } catch (err) {
      console.error("Add to cart failed:", err);
      throw err;
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      await cartAPI.updateItem(itemId, quantity);
      await fetchCart();
    } catch (err) {
      console.error("Update cart failed:", err);
      throw err;
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
    } catch (err) {
      console.error("Remove item failed:", err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], total: 0 });
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  const cartCount =
    cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
