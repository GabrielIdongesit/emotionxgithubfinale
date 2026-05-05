import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { MdFavorite, MdHelp } from "react-icons/md";
import { HiUser } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import logo from "../assets/emotionxLogo.jpeg";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = ({ setSearchTerm }) => {
  const [nav, setNav] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const getUserAvatar = (name) => name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="bg-white top-0 sticky z-50 mx-auto flex justify-between items-center p-4 relative">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-2">
        <div onClick={() => setNav(!nav)} className="cursor-pointer">
          <AiOutlineMenu
            className="hover:bg-teal-400 p-2 hover:text-white hover:rounded-full"
            size={40}
          />
        </div>
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="E-MotionX"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-bold text-lg hidden sm:block">
            E-<span className="text-green-500">MotionX</span>
          </span>
        </NavLink>
      </div>

      {/* Search */}
      <div className="bg-gray-200 rounded-full flex items-center px-2 w-full sm:w-[400px] lg:w-[500px] mx-4">
        <AiOutlineSearch size={25} />
        <input
          type="text"
          placeholder="Search Bikes"
          className="bg-transparent p-2 focus:outline-none w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center bg-gray-200 rounded-full p-1 text-[14px]">
          <NavLink
            to="/delivery"
            className={({ isActive }) =>
              `cursor-pointer rounded-full p-2 ${isActive ? "bg-green-400 text-white" : "font-semibold"}`
            }
          >
            Delivery
          </NavLink>
          <NavLink
            to="/pickup"
            className={({ isActive }) =>
              `cursor-pointer rounded-full p-2 ${isActive ? "bg-green-400 text-white" : "font-semibold"}`
            }
          >
            Pickup
          </NavLink>
        </div>

        <NavLink
          to="/cart"
          className="text-black flex border p-3 border-teal-400 items-center rounded-full relative"
        >
          <BsFillCartFill size={20} className="mr-2" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </NavLink>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="w-8 h-8 rounded-full bg-teal-500 flex cursor-pointer items-center justify-center text-white font-bold text-sm">
                {getUserAvatar(user.fullName)}
              </div>
              <span className="text-sm italic text-gray-600">
                Hi, {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/Signin"
                className="text-xl hover:bg-teal-600 hover:text-white border hover:scale-105 duration-300 rounded-xl p-2 uppercase font-semibold flex items-center"
              >
                <HiUser size={25} className="mr-2" /> Login
              </NavLink>
              <NavLink
                to="/SignUp"
                className="text-xl hover:bg-teal-600 hover:text-white border hover:scale-105 duration-300 rounded-xl p-2 uppercase font-semibold flex items-center"
              >
                <HiUser size={25} className="mr-2" /> Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>

      {nav && (
        <div
          className="fixed top-0 left-0 w-full h-screen bg-black/80 z-20"
          onClick={() => setNav(false)}
        />
      )}

      {nav && (
        <div
          onClick={() => setNav(false)}
          className="absolute top-4 right-4 cursor-pointer z-30"
        >
          <AiOutlineClose
            className="hover:bg-teal-400 p-2 hover:text-white hover:rounded-full"
            size={35}
          />
        </div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-[300px] h-screen bg-white z-30 transition-transform duration-300 ${nav ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer logo header */}
        <div className="flex items-center gap-3 p-4 bg-black">
          <img
            src={logo}
            alt="E-MotionX"
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="font-bold text-lg text-white">
            E-<span className="text-green-400">MotionX</span>
          </span>
        </div>

        <nav>
          <ul className="flex flex-col p-4 text-gray-800">
            <NavLink to="/" onClick={() => setNav(false)}>
              <li className="text-xl hover:bg-teal-600 hover:text-white border rounded-xl p-2 my-2 uppercase font-semibold flex items-center">
                <MdFavorite size={25} className="mr-2" /> Home
              </li>
            </NavLink>

            {!user && (
              <NavLink to="/Signin" onClick={() => setNav(false)}>
                <li className="text-xl hover:bg-teal-600 hover:text-white border cursor-pointer rounded-xl p-2 my-2 uppercase font-semibold flex items-center">
                  <HiUser size={25} className="mr-2" /> Login
                </li>
              </NavLink>
            )}

            {user && (
              <li
                onClick={handleLogout}
                className="text-xl hover:bg-red-500 hover:text-white border rounded-xl p-2 my-2 uppercase font-semibold flex items-center cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xs mr-2">
                  {getUserAvatar(user.fullName)}
                </div>
                Logout
              </li>
            )}

            <NavLink to="/ContactUs" onClick={() => setNav(false)}>
              <li className="text-xl hover:bg-teal-600 hover:text-white border rounded-xl p-2 my-2 uppercase font-semibold flex items-center">
                <MdFavorite size={25} className="mr-2" /> Contact Us
              </li>
            </NavLink>

            <NavLink to="/AboutUs" onClick={() => setNav(false)}>
              <li className="text-xl hover:bg-teal-600 hover:text-white border cursor-pointer rounded-xl p-2 my-2 uppercase font-semibold flex items-center">
                <MdHelp size={25} className="mr-2" /> About Us
              </li>
            </NavLink>

            <NavLink to="/admin-dashboard" onClick={() => setNav(false)}>
              <li className="text-xl hover:bg-teal-600 hover:text-white border rounded-xl p-2 my-2 uppercase font-semibold flex items-center">
                Admin Dashboard
              </li>
            </NavLink>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
