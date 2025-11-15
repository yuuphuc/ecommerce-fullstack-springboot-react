import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";

function AdminRoute({ children }) {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();
  
  console.log("🛡️ AdminRoute Check:");
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - userRole:", userRole);

  // Chưa đăng nhập → Redirect login
  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to /login");
    return <Navigate to="/login" state={{ from: "/admin" }} replace />;
  }

  // Đã đăng nhập nhưng không phải ADMIN → 404
  if (userRole !== "ADMIN") {
    console.log("❌ Not ADMIN, redirecting to /404");
    return <Navigate to="/404" replace />;
  }

  // Là ADMIN → Cho phép truy cập
  console.log("✅ ADMIN access granted");
  return children;
}

export default AdminRoute;