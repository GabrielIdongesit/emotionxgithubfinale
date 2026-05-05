import React from "react";
import logo from "../assets/emotionxLogo.jpeg";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-24 bg-black text-white w-full">
      {/* Main footer body */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <img
            src={logo}
            alt="E-MotionX"
            className="h-20 w-20 rounded-full object-cover border-2 border-green-500"
          />
          <h2 className="text-xl font-bold">
            E-<span className="text-green-400">MotionX</span>
          </h2>
          <p className="text-gray-400 text-sm text-center md:text-left max-w-[200px]">
            Where Performance Meets Innovation.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="font-semibold text-green-400 uppercase text-sm mb-1">
            Quick Links
          </h3>
          {[
            { label: "Home", to: "/" },
            { label: "About Us", to: "/AboutUs" },
            { label: "Contact Us", to: "/ContactUs" },
            { label: "Spare Parts", to: "/spare-parts" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-gray-400 hover:text-green-400 text-sm transition"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Services */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="font-semibold text-green-400 uppercase text-sm mb-1">
            Services
          </h3>
          {["Delivery", "Pickup", "Bike Repairs", "Spare Parts"].map((s) => (
            <span key={s} className="text-gray-400 text-sm">
              {s}
            </span>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="font-semibold text-green-400 uppercase text-sm mb-1">
            Contact
          </h3>
          <p className="text-gray-400 text-sm">support@emotionx.com</p>
          <p className="text-gray-400 text-sm">+1 (800) EMOTIONX</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 px-6">
        <img
          src={logo}
          alt="E-MotionX"
          className="h-6 w-6 rounded-full object-cover"
        />
        <p className="text-gray-500 text-xs text-center">
          © {new Date().getFullYear()} E-MotionX Services. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
