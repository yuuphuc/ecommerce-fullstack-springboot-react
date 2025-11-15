// src/components/admin/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCoffee,
  FaList,
  FaClipboardList,
  FaEnvelope,
  FaHistory,
  FaUsers,
  FaCog,
  FaHeadset,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    { path: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/admin/products", icon: <FaCoffee />, label: "Products" },
    { path: "/admin/categories", icon: <FaList />, label: "Categories" },
    { path: "/admin/orders", icon: <FaClipboardList />, label: "Orders" },
    { path: "/admin/messages", icon: <FaEnvelope />, label: "Messages" },
    { path: "/admin/history", icon: <FaHistory />, label: "History" },
    { path: "/admin/communities", icon: <FaUsers />, label: "Communities" },
    { path: "/admin/settings", icon: <FaCog />, label: "Settings" },
    { path: "/admin/support", icon: <FaHeadset />, label: "Support" },
  ];

  return (
    <div className="bg-gray-900 text-gray-300 w-64 min-h-screen flex flex-col justify-between p-5 border-r border-gray-700">
      <div>
        <div className="text-white font-bold text-2xl mb-8 flex items-center space-x-2">
          <FaTachometerAlt className="text-indigo-500" />
          <span>YUU PHÚC</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;