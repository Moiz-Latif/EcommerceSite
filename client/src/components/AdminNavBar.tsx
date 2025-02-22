import React, { useState } from 'react';
import img from '../assets/ghost.jpg';
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AdminNavBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  async function handleClick(){
    const response = await axios('http://localhost:3000/AdminLogout',{withCredentials:true});
    console.log(response.data);
    navigate('/AdminLogin');
  }

  return (
    <nav className="pl-56 fixed w-full h-16 bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between shadow-sm z-20">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <input
          type="text"
          placeholder="Search anything here"
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black text-gray-700 placeholder-gray-400"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Right Side Items */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button className="text-black hover:text-gray-600 transition-colors">
          <FaBell className="w-5 h-5" />
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src={img}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-black object-cover"
            />
            <span className="font-bold text-black">Moiz Latif</span>
            <FaChevronDown className="text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-gray-700">Muhammad Moiz Latif</p>
                <p className="text-xs text-gray-500">moizlatif4137@gmail.com</p>
              </div>
              <hr className="my-2 border-gray-200" />
              <a
                href="#profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <a
                href="#settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "

              >
                Settings
              </a>
              <button className="pr-28 w-full py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleClick}>
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};