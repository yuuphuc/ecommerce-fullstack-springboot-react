// src/pages/Checkout.jsx - WITH AUTO-FILL USER INFO
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CartService from "../services/CartService";
import OrderService from "../services/OrderService";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import { validateRequired, validatePhone } from "../utils/validation";
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaUser } from "react-icons/fa";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedItemIds = location.state?.selectedItems || [];

  const [formData, setFormData] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    paymentMethod: "COD",
    note: "",
  });

  useEffect(() => {
    fetchCart();
    //  Auto-load thông tin user nếu đã login
    loadUserProfile();
  }, []);

  // Load thông tin user để auto-fill
  const loadUserProfile = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        setLoadingProfile(true);
        const profile = await UserService.getProfile();
        
        // Auto-fill vào form
        setFormData(prev => ({
          ...prev,
          //shippingName: profile.username || prev.shippingName,
          shippingPhone: profile.phoneNumber || prev.shippingPhone,
          shippingAddress: profile.address || prev.shippingAddress,
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Không show error, chỉ log
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await CartService.getCart();
      
      if (!selectedItemIds || selectedItemIds.length === 0) {
        alert("Vui lòng chọn sản phẩm để thanh toán!");
        navigate("/cart");
        return;
      }
      
      if (!data.items || data.items.length === 0) {
        alert("Giỏ hàng trống!");
        navigate("/cart");
        return;
      }
      
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateRequired(formData.shippingName, "Họ tên");
    if (nameError) newErrors.shippingName = nameError;

    const phoneError = validatePhone(formData.shippingPhone);
    if (!formData.shippingPhone) {
      newErrors.shippingPhone = "Số điện thoại không được để trống";
    } else if (!phoneError) {
      newErrors.shippingPhone = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }

    const addressError = validateRequired(formData.shippingAddress, "Địa chỉ");
    if (addressError) newErrors.shippingAddress = addressError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  QR Code với thông tin THẬT của bạn
  const getQrUrl = () => {
    if (formData.paymentMethod !== "BANK_TRANSFER") return null;

    // THAY BẰNG THÔNG TIN TÀI KHOẢN THẬT CỦA BẠN
    const bank = "970416"; // Mã ngân hàng ACB
    const accountNumber = "19871881"; // THAY BẰNG STK THẬT
    const accountName = "LAU DUY PHUC"; // THAY BẰNG TÊN THẬT
    const amount = selectedTotal;
    const description = `Thanh toan don hang YUU CAFE`;

    // VietQR format
    return `https://img.vietqr.io/image/${bank}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (selectedItems.length === 0) {
      alert("Không có sản phẩm nào được chọn!");
      return;
    }

    setSubmitting(true);
    try {
      const order = await OrderService.createOrder(formData);
      alert(`✅ Đặt hàng thành công! Mã đơn hàng: ${order.orderCode}`);
      navigate("/my-orders");
    } catch (error) {
      alert("❌ Lỗi: " + (error.data || "Không thể đặt hàng"));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedItems = cart?.items?.filter(item => 
    selectedItemIds.includes(item.id)
  ) || [];

  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="container mx-auto px-6">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition mb-8"
        >
          <FaArrowLeft />
          <span>Quay lại giỏ hàng</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
          <FaCheckCircle className="text-purple-400" />
          <span>Thanh toán</span>
        </h1>

        {selectedItems.length === 0 ? (
          <div className="bg-red-600/20 border border-red-500 rounded-lg p-8 text-center">
            <FaExclamationCircle className="text-red-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Không có sản phẩm nào được chọn!
            </h2>
            <p className="text-gray-300 mb-6">
              Vui lòng quay lại giỏ hàng và chọn sản phẩm để thanh toán.
            </p>
            <button
              onClick={() => navigate("/cart")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-8 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Thông tin giao hàng</h2>
                  
                  {/* Hiển thị trạng thái auto-fill */}
                  {loadingProfile && (
                    <span className="text-sm text-gray-400 flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                      <span>Đang tải thông tin...</span>
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Họ tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 ${
                      errors.shippingName ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.shippingName && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <FaExclamationCircle />
                      <span>{errors.shippingName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="shippingPhone"
                    value={formData.shippingPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 ${
                      errors.shippingPhone ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                    }`}
                    placeholder="0912345678"
                  />
                  {errors.shippingPhone && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <FaExclamationCircle />
                      <span>{errors.shippingPhone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 resize-none ${
                      errors.shippingAddress ? 'border-2 border-red-500' : 'focus:ring-purple-500'
                    }`}
                    placeholder="Số nhà, đường, phường, quận, thành phố"
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <FaExclamationCircle />
                      <span>{errors.shippingAddress}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Phương thức thanh toán <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="COD">💵 Thanh toán khi nhận hàng (COD)</option>
                    <option value="BANK_TRANSFER">🏦 Chuyển khoản ngân hàng (ACB)</option>
                  </select>
                </div>

                {/*  QR Code với thông tin THẬT */}
                {formData.paymentMethod === "BANK_TRANSFER" && (
                  <div className="bg-gray-900 p-6 rounded-lg border border-purple-500 animate-fadeIn">
                    <h3 className="text-white text-lg font-semibold mb-4 text-center">
                      Quét mã QR để thanh toán
                    </h3>
                    <img 
                      src={getQrUrl()} 
                      alt="QR Code" 
                      className="mx-auto rounded-lg shadow-xl max-w-xs w-full"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=QR+Code+Error';
                      }}
                    />
                    <div className="mt-4 space-y-2 bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Ngân hàng:</span>
                        <span className="text-white font-semibold">ACB (970416)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Số tài khoản:</span>
                        <span className="text-white font-semibold">19871881</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Chủ tài khoản:</span>
                        <span className="text-white font-semibold">YUU COFFEE SHOP</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
                        <span className="text-gray-400">Số tiền:</span>
                        <span className="text-green-400 font-bold text-lg">
                          {selectedTotal.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>
                    
                    {/* ⚠️ Hướng dẫn thay thông tin
                    <div className="mt-4 bg-yellow-900/20 border border-yellow-600 rounded-lg p-3 text-xs text-yellow-300">
                      <p className="font-semibold mb-1">⚠️ Lưu ý cho Developer:</p>
                      <p>Thay thông tin tài khoản THẬT trong code tại dòng 52-54</p>
                    </div> */}
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 mb-2">Ghi chú</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg resize-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ghi chú thêm về đơn hàng..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Đơn hàng của bạn ({selectedItems.length} sản phẩm)
                </h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-300">
                      <div className="flex-1">
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-gray-400">x{item.quantity}</p>
                      </div>
                      <span className="font-semibold text-purple-400">
                        {item.subtotal.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">
                      {selectedTotal.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-green-400">Miễn phí</span>
                  </div>

                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-purple-400">
                        {selectedTotal.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;