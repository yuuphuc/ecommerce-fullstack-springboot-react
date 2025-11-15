// src/pages/Profile.jsx - WITH CHANGE PASSWORD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";
import { validateEmail, validatePhone, validatePassword } from "../utils/validation";
import { FieldError, ValidationErrors } from "../components/FormValidation";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaEdit,
    FaArrowLeft,
    FaShieldAlt,
    FaSignOutAlt,
    FaSave,
    FaTimes,
    FaKey,
    FaLock
} from "react-icons/fa";

function Profile() {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    
    // State cho đổi mật khẩu
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        address: "",
        role: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profile = await UserService.getProfile();
            setUserData({
                username: profile.username || "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber || "",
                address: profile.address || "",
                role: profile.role || "USER"
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            alert("❌ Không thể tải thông tin profile");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
            AuthService.logout();
            navigate("/login");
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (userData.email && !validateEmail(userData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (userData.phoneNumber && !validatePhone(userData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ (VD: 0912345678)";
        }

        if (userData.address && userData.address.length > 500) {
            newErrors.address = "Địa chỉ không được quá 500 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            const updateData = {
                email: userData.email || null,
                phoneNumber: userData.phoneNumber || null,
                address: userData.address || null
            };

            const updatedProfile = await UserService.updateProfile(updateData);
            
            setUserData({
                username: updatedProfile.username,
                email: updatedProfile.email || "",
                phoneNumber: updatedProfile.phoneNumber || "",
                address: updatedProfile.address || "",
                role: updatedProfile.role
            });

            alert("✅ Cập nhật thông tin thành công!");
            setEditing(false);
            setErrors({});
        } catch (error) {
            console.error("Error updating profile:", error);
            
            if (error.data?.errors) {
                setErrors(error.data.errors);
            } else {
                alert("❌ Lỗi: " + (error.data?.message || "Không thể cập nhật profile"));
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setErrors({});
        fetchProfile();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Validate form đổi mật khẩu
    const validatePasswordForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
        }

        const passwordError = validatePassword(passwordData.newPassword);
        if (!passwordData.newPassword) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        } else if (passwordError) {
            newErrors.newPassword = passwordError;
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        if (passwordData.currentPassword === passwordData.newPassword && passwordData.currentPassword) {
            newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu cũ";
        }

        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Xử lý đổi mật khẩu
    const handleChangePassword = async () => {
        if (!validatePasswordForm()) {
            return;
        }

        setChangingPassword(true);
        try {
            await UserService.changePassword(passwordData);
            
            alert("✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            
            // Reset form
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setPasswordErrors({});
            setShowChangePassword(false);
            
            // Logout và redirect
            AuthService.logout();
            navigate("/login");
        } catch (error) {
            console.error("Error changing password:", error);
            
            if (error.data?.message) {
                setPasswordErrors({ general: error.data.message });
            } else {
                alert("❌ Lỗi: " + (error.data || "Không thể đổi mật khẩu"));
            }
        } finally {
            setChangingPassword(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
        
        if (passwordErrors[name]) {
            setPasswordErrors({ ...passwordErrors, [name]: "" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
            <div className="container mx-auto px-6 max-w-4xl">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition mb-8"
                >
                    <FaArrowLeft />
                    <span>Quay lại trang chủ</span>
                </button>

                <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600"></div>

                    <div className="px-8 pb-8">
                        <div className="flex items-end justify-between -mt-16 mb-6">
                            <div className="flex items-end space-x-6">
                                <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-800 flex items-center justify-center">
                                    <FaUser className="text-6xl text-gray-400" />
                                </div>

                                <div className="mb-2">
                                    <h1 className="text-3xl font-bold text-white mb-1">{userData.username}</h1>
                                    <div className="flex items-center space-x-2">
                                        <FaShieldAlt className={userData.role === "ADMIN" ? "text-yellow-500" : "text-blue-500"} />
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${userData.role === "ADMIN"
                                            ? "bg-yellow-900/30 text-yellow-400 border border-yellow-900"
                                            : "bg-blue-900/30 text-blue-400 border border-blue-900"
                                            }`}>
                                            {userData.role === "ADMIN" ? "Administrator" : "User"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                {!editing ? (
                                    <>
                                        {/* ✅ Nút đổi mật khẩu */}
                                        <button
                                            onClick={() => setShowChangePassword(true)}
                                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                                        >
                                            <FaKey />
                                            <span>Đổi mật khẩu</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
                                        >
                                            <FaEdit />
                                            <span>Chỉnh sửa</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 px-6 py-3 rounded-lg transition border border-red-900"
                                        >
                                            <FaSignOutAlt />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaSave />
                                            <span>{saving ? "Đang lưu..." : "Lưu"}</span>
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                                        >
                                            <FaTimes />
                                            <span>Hủy</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <ValidationErrors errors={errors} />

                        {/* Profile Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div>
                                <label className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                                    <FaEnvelope />
                                    <span>Email</span>
                                </label>
                                {editing ? (
                                    <>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 ${
                                                errors.email ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                                            }`}
                                            placeholder="your.email@example.com"
                                        />
                                        <FieldError error={errors.email} />
                                    </>
                                ) : (
                                    <p className="text-white text-lg">
                                        {userData.email || "Chưa cập nhật"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                                    <FaPhone />
                                    <span>Số điện thoại</span>
                                </label>
                                {editing ? (
                                    <>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={userData.phoneNumber}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 ${
                                                errors.phoneNumber ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                                            }`}
                                            placeholder="0912345678"
                                        />
                                        <FieldError error={errors.phoneNumber} />
                                    </>
                                ) : (
                                    <p className="text-white text-lg">
                                        {userData.phoneNumber || "Chưa cập nhật"}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                                    <FaMapMarkerAlt />
                                    <span>Địa chỉ</span>
                                </label>
                                {editing ? (
                                    <>
                                        <textarea
                                            name="address"
                                            value={userData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 resize-none ${
                                                errors.address ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                                            }`}
                                            placeholder="Nhập địa chỉ của bạn..."
                                        />
                                        <FieldError error={errors.address} />
                                    </>
                                ) : (
                                    <p className="text-white text-lg">
                                        {userData.address || "Chưa cập nhật"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8 pt-8 border-t border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Truy cập nhanh</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button
                                    onClick={() => navigate("/my-orders")}
                                    className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition text-center"
                                >
                                    <div className="text-2xl mb-2">📦</div>
                                    <div className="text-sm">Đơn hàng</div>
                                </button>

                                <button
                                    onClick={() => navigate("/cart")}
                                    className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition text-center"
                                >
                                    <div className="text-2xl mb-2">🛒</div>
                                    <div className="text-sm">Giỏ hàng</div>
                                </button>

                                {userData.role === "ADMIN" && (
                                    <button
                                        onClick={() => navigate("/admin")}
                                        className="bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400 p-4 rounded-lg transition text-center border border-yellow-900"
                                    >
                                        <div className="text-2xl mb-2">⚙️</div>
                                        <div className="text-sm">Admin</div>
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate("/")}
                                    className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition text-center"
                                >
                                    <div className="text-2xl mb-2">🏠</div>
                                    <div className="text-sm">Trang chủ</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal đổi mật khẩu */}
                {showChangePassword && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-gray-800 rounded-xl max-w-md w-full p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                    <FaKey className="text-blue-400" />
                                    <span>Đổi mật khẩu</span>
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowChangePassword(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: ""
                                        });
                                        setPasswordErrors({});
                                    }}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {passwordErrors.general && (
                                <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                                    {passwordErrors.general}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Mật khẩu hiện tại <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 ${
                                                passwordErrors.currentPassword ? 'border-2 border-red-500' : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                    </div>
                                    <FieldError error={passwordErrors.currentPassword} />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Mật khẩu mới <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 ${
                                                passwordErrors.newPassword ? 'border-2 border-red-500' : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                        />
                                    </div>
                                    <FieldError error={passwordErrors.newPassword} />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 ${
                                                passwordErrors.confirmPassword ? 'border-2 border-red-500' : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>
                                    <FieldError error={passwordErrors.confirmPassword} />
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={changingPassword}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                                >
                                    {changingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowChangePassword(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: ""
                                        });
                                        setPasswordErrors({});
                                    }}
                                    disabled={changingPassword}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;