'use client'

import { useState } from "react";
import { AdminLogin } from "../pages/AdminLogin";
import logo from "../assets/blockchain.png";
import img from "../assets/sarah-dorweiler-QeVmJxZOv3k-unsplash.jpg";
import adminImg from "../assets/admin-background.jpg";
import { NavLink } from "react-router-dom";
import { UserLogin } from "../pages/UserLogin";
import { UserSignup } from "../pages/UserSignup";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsAdmin(false);
  };

  const toggleAdminUser = () => {
    setIsAdmin(!isAdmin);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen w-screen bg-zinc-300 flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] p-2">
        <div className="md:w-1/2 relative h-64 md:h-auto font-roboto rounded-xl">
          <img src={logo} className="absolute w-11 left-4 top-4 z-10" alt="Logo" />
          <img
            src={isAdmin ? adminImg : img}
            className="h-full w-full object-cover rounded-xl"
            alt="Decorative"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <h1 className="text-white text-2xl md:text-4xl text-center px-4 font-afacad">
              {isAdmin ? "Admin Access," : "From Devices to Dreams,"}
              <br />
              {isAdmin ? "To Innovate and Inspire" : "Your Tech Marketplace"}
            </h1>
          </div>
        </div>
        <div className="md:w-1/2 p-6 md:p-8 overflow-auto">
          <div className="flex justify-center mb-6">
            <NavLink
              to='AdminLogin'
              onClick={toggleAdminUser}
              className={`px-6 py-2 rounded-l-full ${isAdmin ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
            >
              Admin
            </NavLink>
            <NavLink
            to="/"
              onClick={toggleAdminUser}
              className={`px-6 py-2 rounded-r-full ${!isAdmin ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
            >
              User
            </NavLink>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 text-gray-800">
            {isAdmin ? "Admin Login" : (isLogin ? "Welcome Back" : "Create an Account")}
          </h2>
          {isAdmin ? (
            <AdminLogin />
          ) : isLogin ? (
            <UserLogin toggleForm={toggleForm} />
          ) : (
            <UserSignup toggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
}