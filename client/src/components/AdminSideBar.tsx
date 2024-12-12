import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/blockchain.png';
import dashboardBlack from '../assets/dashboard.png';
import dashboardWhite from '../assets/dashboard (1).png';
import usersBlack from '../assets/group.png';
import usersWhite from '../assets/group (1).png';
import devicesBlack from '../assets/responsive.png';
import devicesWhite from '../assets/responsive (1).png';
import approvalsBlack from '../assets/file.png';
import approvalsWhite from '../assets/file (1).png';
import categoriesBlack from '../assets/menu.png';
import categoriesWhite from '../assets/menu (1).png';
import logoutBlack from '../assets/logout.png';
import logoutWhite from '../assets/logout (1).png';

export const AdminSideBar = () => {
  const navItems = [
    { to: "", icon: { black: dashboardBlack, white: dashboardWhite }, label: "Dashboard" },
    { to: "Users", icon: { black: usersBlack, white: usersWhite }, label: "All Users" },
    { to: "Devices", icon: { black: devicesBlack, white: devicesWhite }, label: "Devices" },
    { to: "approvals", icon: { black: approvalsBlack, white: approvalsWhite }, label: "Approvals" },
    { to: "categories", icon: { black: categoriesBlack, white: categoriesWhite }, label: "Categories" },
    { to: "/AdminLogin", icon: { black: logoutBlack, white: logoutWhite }, label: "Logout" },
  ];

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="w-52 h-screen bg-white font-roboto flex flex-col justify-start p-3 border-r-[1px] border-gray-300 fixed z-30">
      {/* Logo and Title */}
      <div className="flex gap-2 justify-start items-center mb-10">
        <img src={logo} className="w-10 h-10" alt="Gizmo Logo" />
        <h1 className="font-semibold text-2xl font-afacad text-gray-800">Gizmo</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-6">
        <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pages</h2>
        <nav className="flex flex-col gap-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex gap-4 items-center p-3 rounded-lg transition-all duration-200 ease-in-out
                ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-black hover:text-white'}`
              }
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive || hoveredItem === item.to ? item.icon.white : item.icon.black}
                    className="w-6 h-6 object-contain"
                    alt={`${item.label} icon`}
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

