import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaSignOutAlt } from "react-icons/fa";
import AuthService from "../../services/AuthService";

function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const username = AuthService.getCurrentUser();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      AuthService.logout();
      navigate("/login");
    }
  };

  return (
    <header className="flex justify-between items-center p-5 bg-gray-900 text-white border-b border-gray-700">
      <div className="text-3xl font-bold">Admin Dashboard</div>
      
      <div className="flex items-center space-x-6">
        <input
          type="text"
          placeholder="mm / dd / yyyy"
          className="bg-gray-800 text-white rounded-md px-3 py-1 focus:outline-none"
        />
        
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <FaMoon /> : <FaSun className="text-yellow-400" />}
        </button>
        
        <div className="text-right">
          <div className="font-semibold">Hey, {username || "Admin"}</div>
          <div className="text-xs text-gray-400">Administrator</div>
        </div>
        
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-purple-500"
        />
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          title="Đăng xuất"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;