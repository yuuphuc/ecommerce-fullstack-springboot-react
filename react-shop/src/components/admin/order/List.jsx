// src/components/admin/order/List.jsx
import React, { useEffect, useState } from "react";
import OrderService from "../../../services/OrderService";
import { FaClipboardList, FaEye, FaTimes, FaCheckCircle } from "react-icons/fa";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getAllOrders();
      setOrders(data);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.status ? `Lỗi ${error.status}: ${error.data}` : "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      alert("✅ Cập nhật trạng thái thành công!");
    } catch (error) {
      alert("❌ Lỗi: " + (error.data || "Không thể cập nhật"));
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    
    try {
      await OrderService.deleteOrder(orderId);
      fetchOrders();
      alert("✅ Xóa đơn hàng thành công!");
    } catch (error) {
      alert("❌ Lỗi xóa đơn hàng");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-900/30 text-yellow-400 border-yellow-500",
      CONFIRMED: "bg-blue-900/30 text-blue-400 border-blue-500",
      PROCESSING: "bg-indigo-900/30 text-indigo-400 border-indigo-500",
      SHIPPING: "bg-purple-900/30 text-purple-400 border-purple-500",
      DELIVERED: "bg-green-900/30 text-green-400 border-green-500",
      CANCELLED: "bg-red-900/30 text-red-400 border-red-500",
    };
    return colors[status] || "bg-gray-900/30 text-gray-400 border-gray-500";
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <FaClipboardList className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Quản lý đơn hàng</h2>
            <p className="text-gray-400 text-sm">Tổng: {orders.length} đơn hàng</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-red-300 hover:text-white">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
              <FaClipboardList className="text-5xl mx-auto mb-4 opacity-30 text-gray-500" />
              <p className="text-lg text-gray-400">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-indigo-500 transition"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-700">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      #{order.orderCode}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                      <p><span className="font-semibold">Khách hàng:</span> {order.username}</p>
                      <p><span className="font-semibold">SĐT:</span> {order.shippingPhone}</p>
                      <p><span className="font-semibold">Ngày đặt:</span> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                      <p><span className="font-semibold">Thanh toán:</span> {order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border font-semibold ${getStatusColor(order.status)}`}>
                      <span>{getStatusText(order.status)}</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {order.totalAmount.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Sản phẩm:</h4>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-300">
                        <span>{item.productName} × {item.quantity}</span>
                        <span className="text-purple-400">{item.subtotal.toLocaleString('vi-VN')} đ</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2"
                      >
                        <FaCheckCircle />
                        <span>Xác nhận</span>
                      </button>
                    )}
                    {order.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "SHIPPING")}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        Giao hàng
                      </button>
                    )}
                    {order.status === "SHIPPING" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        Hoàn thành
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2"
                    >
                      <FaEye />
                      <span>Chi tiết</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-500 hover:text-red-400 px-4 py-2 transition"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Chi tiết đơn hàng</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4 text-gray-300">
              <p><span className="font-semibold">Mã đơn:</span> {selectedOrder.orderCode}</p>
              <p><span className="font-semibold">Người nhận:</span> {selectedOrder.shippingName}</p>
              <p><span className="font-semibold">SĐT:</span> {selectedOrder.shippingPhone}</p>
              <p><span className="font-semibold">Địa chỉ:</span> {selectedOrder.shippingAddress}</p>
              {selectedOrder.note && (
                <p><span className="font-semibold">Ghi chú:</span> {selectedOrder.note}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;