// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Bike from "./components/Bike";
import Footer from "./components/Footer";
import HeadlineCard from "./components/HeadlineCard";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Signin from "./components/Signin";
import SignUp from "./components/SignUp";
import ProductPreview from "./components/ProductPreview";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import AdminDashboard from "./components/AdminDashboard";
import Pickup from "./pages/Pickup";
import Delivery from "./pages/Delivery";
import ForgotPassword from "./components/ForgotPassword";
import VerifyEmail from "./components/VerifyEmail";
import SpareParts from "./components/SpareParts";
import AdminLogin from "./components/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import SuccessPage from "./components/SuccessPage";
import PaymentOptionsPage from "./components/PaymentOptionsPage";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Layout wrapper
const Layout = ({ children }) => (
  <>
    <main>{children}</main>
    <Footer />
  </>
);

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/SignUp" replace />;
  return children;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // NOTE: cart state & functions (addToCart, increaseQty etc.) have been
  // removed from here. They now live in CartContext and talk to the backend.
  // Use useCart() inside any component that needs them.

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Navbar reads cartCount from CartContext internally */}
          <Navbar setSearchTerm={setSearchTerm} />

          <Routes>
            {/* ── Public pages ───────────────────────────── */}
            <Route
              path="/Signin"
              element={
                <Layout>
                  <Signin />
                </Layout>
              }
            />
            <Route
              path="/SignUp"
              element={
                <Layout>
                  <SignUp />
                </Layout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Layout>
                  <ForgotPassword />
                </Layout>
              }
            />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/AboutUs"
              element={
                <Layout>
                  <AboutUs />
                </Layout>
              }
            />
            <Route
              path="/ContactUs"
              element={
                <Layout>
                  <ContactUs />
                </Layout>
              }
            />
            <Route path="/spare-parts" element={<SpareParts />} />

            {/* ── Protected: logged-in users only ────────── */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Hero />
                    <HeadlineCard />
                    <Bike
                      searchTerm={searchTerm}
                      setSelectedProduct={setSelectedProduct}
                    />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Cart />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Checkout />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentOptionsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/success"
              element={
                <Layout>
                  <SuccessPage />
                </Layout>
              }
            />

            {/* ── Pickup & Delivery ───────────────────────── */}
            <Route path="/pickup" element={<Pickup />} />
            <Route path="/delivery" element={<Delivery />} />

            {/* ── Admin ───────────────────────────────────── */}
            {/* /admin-dashboard → shows the AdminLogin form */}
            <Route path="/admin-dashboard" element={<AdminLogin />} />

            {/* /admin-login → the actual dashboard (protected) */}
            <Route
              path="/admin-login"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
          </Routes>

          {/* Product Quick View Modal */}
          <ProductPreview
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
