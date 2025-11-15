// src/pages/MyOrders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import { FaClipboardList, FaArrowLeft, FaTimes, FaCheckCircle, FaClock, FaTruck } from "react-icons/fa";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      await OrderService.cancelOrder(orderId);
      fetchOrders();
      alert("✅ Đơn hàng đã được hủy");
    } catch (error) {
      alert("❌ Lỗi: " + (error.data || "Không thể hủy đơn hàng"));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-900/30 text-yellow-400",
      CONFIRMED: "bg-blue-900/30 text-blue-400",
      PROCESSING: "bg-indigo-900/30 text-indigo-400",
      SHIPPING: "bg-purple-900/30 text-purple-400",
      DELIVERED: "bg-green-900/30 text-green-400",
      CANCELLED: "bg-red-900/30 text-red-400",
    };
    return colors[status] || "bg-gray-900/30 text-gray-400";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <FaClock />,
      CONFIRMED: <FaCheckCircle />,
      PROCESSING: <FaClock />,
      SHIPPING: <FaTruck />,
      DELIVERED: <FaCheckCircle />,
      CANCELLED: <FaTimes />,
    };
    return icons[status] || <FaClock />;
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao hàng",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Đã hủy",
    };
    return texts[status] || status;
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
      <div className="container mx-auto px-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition mb-8"
        >
          <FaArrowLeft />
          <span>Quay lại trang chủ</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
          <FaClipboardList className="text-purple-400" />
          <span>Đơn hàng của tôi</span>
        </h1>

        {orders.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <FaClipboardList className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-6">Bạn chưa có đơn hàng nào</p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition"
            >
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Mã đơn hàng: {order.orderCode}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-gray-300">
                      <div>
                        <p className="font-semibold text-white">{item.productName}</p>
                        <p className="text-sm">
                          {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-purple-400">
                        {item.subtotal.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="text-gray-300">
                    <p className="mb-1">
                      <span className="font-semibold">Người nhận:</span> {order.shippingName}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">SĐT:</span> {order.shippingPhone}
                    </p>
                    <p>
                      <span className="font-semibold">Địa chỉ:</span> {order.shippingAddress}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white mb-2">
                      {order.totalAmount.toLocaleString('vi-VN')} đ
                    </p>
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2"
                      >
                        <FaTimes />
                        <span>Hủy đơn</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;