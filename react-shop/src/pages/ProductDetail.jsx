// src/pages/ProductDetail.jsx - COFFEE SHOP THEME
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import AuthService from "../services/AuthService";
import {
  FaShoppingCart,
  FaArrowLeft,
  FaCoffee,
  FaMinus,
  FaPlus,
  FaStar,
  FaUser
} from "react-icons/fa";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0); 
  const username = AuthService.getCurrentUser();

  useEffect(() => {
    fetchProduct();
    fetchCartCount(); 
  }, [id]);

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        const cart = await CartService.getCart();
        setCartCount(cart.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getById(id);
      setProduct(data);

      if (data.categoryId) {
        const related = await ProductService.findByCategory(data.categoryId);
        setRelatedProducts(related.filter(p => p.id !== parseInt(id)));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Product not found!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!AuthService.isAuthenticated()) {
      alert("Please login to add to cart!");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    try {
      await CartService.addToCart(product.id, quantity);
      fetchCartCount(); 
      alert(`✅ Added ${quantity} ${product.name} to cart!`);
      setQuantity(1);
    } catch (error) {
      alert("❌ Error: " + (error.data || "Cannot add to cart"));
    }
  };

  const handleBuyNow = async () => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    try {
      await CartService.addToCart(product.id, quantity);
      navigate("/cart");
    } catch (error) {
      alert("❌ Error: " + (error.data || "Cannot add to cart"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0e0a] via-[#2d1810] to-[#1a0e0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0e0a] via-[#2d1810] to-[#1a0e0a]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3d2415] to-[#1a0e0a] backdrop-blur-lg shadow-2xl sticky top-0 z-50 border-b border-amber-900/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-3 rounded-full">
                <FaCoffee className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                AD Cafe
              </h1>
            </div>

            {/* User actions với cart count */}
            <div className="flex items-center space-x-4">
              {username && (
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 bg-[#3d2415] hover:bg-[#4d2815] px-4 py-2 rounded-lg transition border border-amber-900/30"
                >
                  <FaUser />
                  <span>{username}</span>
                </button>
              )}

              <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 px-4 py-2 rounded-lg transition shadow-lg"
              >
                <FaShoppingCart />
                <span>Cart</span>
                {/* Cart badge */}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-900/30">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-[600px] object-cover"
              />
            ) : (
              <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-950">
                <FaCoffee className="text-amber-400 text-9xl opacity-30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-amber-400 text-sm font-semibold mb-2 uppercase tracking-wider">Coffee Shop</p>
              <h1 className="text-6xl font-bold text-white mb-4">{product.name}</h1>
              <p className="text-amber-300/70 text-lg leading-relaxed">
                {product.description || "A coffee drink known for its chocolate sweet, rich, and delightful blend, perfect for any time of day."}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(i => (
                <FaStar key={i} className="text-amber-400 text-xl" />
              ))}
              <span className="text-amber-300/70 text-lg ml-3">(4.9)</span>
            </div>

            <div className="border-t border-b border-amber-900/30 py-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-amber-400/70 text-lg">Price:</span>
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  {product.price?.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-amber-400/70 text-lg">Status:</span>
                <span className={`px-4 py-2 rounded-full font-semibold ${product.quantity > 0
                    ? 'bg-green-900/30 text-green-400 border border-green-900'
                    : 'bg-red-900/30 text-red-400 border border-red-900'
                  }`}>
                  {product.quantity > 0 ? `Stock: ${product.quantity}` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-amber-400/70 text-lg">Quantity:</span>
              <div className="flex items-center space-x-2 bg-[#3d2415] rounded-lg border border-amber-900/30">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-[#4d2815] rounded-l-lg transition text-amber-400"
                  disabled={product.quantity === 0}
                >
                  <FaMinus />
                </button>
                <span className="px-8 text-2xl font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="p-3 hover:bg-[#4d2815] rounded-r-lg transition text-amber-400"
                  disabled={product.quantity === 0}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                className="bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-900 hover:to-black text-white py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-amber-900"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center space-x-3">
              <FaCoffee className="text-amber-400" />
              <span>Related Products</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((related) => (
                <div
                  key={related.id}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(`/product/${related.id}`);
                  }}
                  className="group bg-gradient-to-br from-[#3d2415] to-[#2d1810] rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-900/50 transition-all duration-300 hover:scale-105 border border-amber-900/20 hover:border-amber-600/50 cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    {related.imageUrl ? (
                      <img
                        src={related.imageUrl}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-950">
                        <FaCoffee className="text-amber-400 text-6xl opacity-30" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-amber-400 transition">
                      {related.name}
                    </h3>
                    <div className="flex items-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <FaStar key={i} className="text-amber-400 text-xs" />
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-amber-400">
                      {related.price?.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetail;