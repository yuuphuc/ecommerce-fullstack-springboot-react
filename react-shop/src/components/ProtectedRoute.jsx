// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthService from "../services/AuthService";

function ProtectedRoute({ children }) {
  const isAuthenticated = AuthService.isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    // Lưu URL hiện tại để redirect sau khi đăng nhập
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;