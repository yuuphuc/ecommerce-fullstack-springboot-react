import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-6">
      <div className="text-center">
        {/* Icon Warning */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 animate-pulse"></div>
            <FaExclamationTriangle className="text-red-500 text-9xl relative animate-bounce" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-4xl font-bold text-white mb-4">
          Không tìm thấy trang
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg"
          >
            <FaHome />
            <span>Về trang chủ</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition border border-gray-700"
          >
            <span>Quay lại</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-gray-500">
          <p className="text-sm">
            Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ hỗ trợ
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;