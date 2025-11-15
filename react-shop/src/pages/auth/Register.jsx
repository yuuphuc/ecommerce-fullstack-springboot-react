import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { 
  validateUsername, 
  validatePassword, 
  validateEmail 
} from "../../utils/validation";
import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaUserPlus, 
  FaExclamationCircle,
  FaCheckCircle 
} from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // Email validation (optional but if provided must be valid)
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await AuthService.register(formData);
      setSuccess("✅ Đăng ký thành công! Đang đăng nhập...");

      setTimeout(async () => {
        try {
          await AuthService.login(formData.username, formData.password);
          navigate(from, { replace: true });
        } catch (err) {
          navigate("/login", { state: { from } });
        }
      }, 1500);
    } catch (err) {
      setError(err || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 1, text: "Yếu", color: "bg-red-500" },
      { strength: 2, text: "Trung bình", color: "bg-yellow-500" },
      { strength: 3, text: "Khá", color: "bg-blue-500" },
      { strength: 4, text: "Mạnh", color: "bg-green-500" },
      { strength: 5, text: "Rất mạnh", color: "bg-green-600" },
    ];

    return levels.find(l => l.strength === strength) || levels[0];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <FaUserPlus className="text-5xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Đăng ký</h2>
          <p className="text-gray-400 mt-2">Tạo tài khoản mới</p>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 flex items-center space-x-2">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-600/20 border border-green-500 text-green-400 px-4 py-3 rounded mb-4 flex items-center space-x-2">
            <FaCheckCircle />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-300 mb-2">Username *</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 ${
                  errors.username ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Nhập username (ít nhất 3 ký tự)"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Nhập password (ít nhất 6 ký tự)"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                <FaExclamationCircle className="text-xs" />
                <span>{errors.password}</span>
              </p>
            )}
            
            {/* Password Strength Indicator */}
            {formData.password && !errors.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{passwordStrength.text}</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-2">Xác nhận Password *</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Nhập lại password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                <FaExclamationCircle className="text-xs" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2">Email (Tùy chọn)</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Nhập email (không bắt buộc)"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                <FaExclamationCircle className="text-xs" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Đã có tài khoản?{" "}
          <Link to="/login" state={{ from }} className="text-blue-400 hover:text-blue-300">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;