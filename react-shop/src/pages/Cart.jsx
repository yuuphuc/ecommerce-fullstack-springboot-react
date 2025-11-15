import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartService from "../services/CartService";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await CartService.getCart();
      setCart(data);
      // Chọn tất cả items khi load
      if (data.items) {
        setSelectedItems(data.items.map(item => item.id));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const updatedCart = await CartService.updateCartItem(itemId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      alert("❌ Lỗi cập nhật số lượng");
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return;
    
    try {
      const updatedCart = await CartService.removeCartItem(itemId);
      setCart(updatedCart);
      // Xóa khỏi selected items
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } catch (error) {
      alert("❌ Lỗi xóa sản phẩm");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Xóa toàn bộ giỏ hàng?")) return;
    
    try {
      await CartService.clearCart();
      fetchCart();
      setSelectedItems([]);
    } catch (error) {
      alert("❌ Lỗi xóa giỏ hàng");
    }
  };

  // Toggle select item
  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Select all
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map(item => item.id));
    }
  };

  // Tính tổng tiền của items được chọn
  const selectedTotal = cart?.items
    ?.filter(item => selectedItems.includes(item.id))
    ?.reduce((sum, item) => sum + item.subtotal, 0) || 0;

  const selectedCount = selectedItems.length;

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
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
          >
            <FaArrowLeft />
            <span>Tiếp tục mua sắm</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <FaShoppingCart />
            <span>Giỏ hàng của bạn</span>
          </h1>
          
          {cart && cart.items && cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-400 hover:text-red-300 transition"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <FaShoppingCart className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-6">Giỏ hàng của bạn đang trống</p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition"
            >
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All Checkbox */}
              <div className="bg-gray-800 rounded-xl p-4 flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cart.items.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-white font-semibold">
                  Chọn tất cả ({cart.items.length} sản phẩm)
                </span>
              </div>

              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 rounded-xl p-6 flex items-center space-x-6"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-5 h-5 cursor-pointer"
                  />

                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <FaShoppingCart className="text-white text-3xl" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.productName}
                    </h3>
                    <p className="text-purple-400 text-lg font-semibold">
                      {item.price.toLocaleString('vi-VN')} đ
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-700 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-3 hover:bg-gray-600 rounded-l-lg transition"
                      >
                        <FaMinus />
                      </button>
                      <span className="px-6 text-lg font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-3 hover:bg-gray-600 rounded-r-lg transition"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <p className="text-2xl font-bold text-white">
                        {item.subtotal.toLocaleString('vi-VN')} đ
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-400 p-3 transition"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-white mb-6">Tổng quan đơn hàng</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Sản phẩm đã chọn:</span>
                    <span className="font-semibold">{selectedCount}</span>
                  </div>
                  
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
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-purple-400">
                        {selectedTotal.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (selectedCount === 0) {
                      alert("Vui lòng chọn ít nhất 1 sản phẩm!");
                      return;
                    }
                    navigate("/checkout", { state: { selectedItems } });
                  }}
                  disabled={selectedCount === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiến hành thanh toán ({selectedCount})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;