import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getPasswordStrength = (password) => {
  if (password.length < 6) return "Weak";
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "Strong";
  return "Medium";
};

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await register({
        fullName: form.name, // your backend expects "fullName"
        email: form.email,
        password: form.password,
        role: "user",
      });

      // Registration successful — backend sends welcome email automatically
      navigate("/signin", {
        state: { message: "Account created! Please sign in." },
      });
    } catch (err) {
      // err.message comes from AuthContext which parses the API error
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Full Name"
          className="border p-2 w-full rounded"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="border p-2 w-full rounded"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border p-2 w-full rounded pr-12"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-teal-600"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <p
          className={`text-sm font-semibold ${
            strength === "Weak"
              ? "text-red-500"
              : strength === "Medium"
                ? "text-yellow-500"
                : "text-green-600"
          }`}
        >
          Password Strength: {strength}
        </p>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          className="border p-2 w-full rounded"
          required
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-teal-600 cursor-pointer font-semibold"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
