import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { validateRequired } from "../../utils/validation";
import { FaUser, FaLock, FaSignInAlt, FaExclamationCircle } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const validateForm = () => {
    const newErrors = {};
    
    const usernameError = validateRequired(username, "Username");
    if (usernameError) newErrors.username = usernameError;
    
    const passwordError = validateRequired(password, "Password");
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await AuthService.login(username, password);
      console.log("✅ Login success:", response);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors({ ...errors, username: "" });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <FaSignInAlt className="text-5xl text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Đăng nhập</h2>
          {from !== "/" && (
            <p className="text-gray-400 mt-2">Vui lòng đăng nhập để tiếp tục</p>
          )}
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 flex items-center space-x-2">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-300 mb-2">Username *</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 ${
                  errors.username ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                }`}
                placeholder="Nhập username"
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                <FaExclamationCircle className="text-xs" />
                <span>{errors.username}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2">Password *</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                }`}
                placeholder="Nhập password"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                <FaExclamationCircle className="text-xs" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Chưa có tài khoản?{" "}
          <Link to="/register" state={{ from }} className="text-purple-400 hover:text-purple-300">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;