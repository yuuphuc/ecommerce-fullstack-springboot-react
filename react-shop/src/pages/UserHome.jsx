// src/pages/UserHome.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import AuthService from "../services/AuthService";
import CategoryService from "../services/CategoryService";
import useClickOutside from "../hooks/useClickOutside";
import { 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt, 
  FaSearch, 
  FaCoffee, 
  FaStar,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaUserShield
} from "react-icons/fa";

function UserHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Ref cho dropdown
  const dropdownRef = useRef(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    categoryId: null,
    minPrice: 0,
    maxPrice: 200000,
    sortBy: "newest"
  });
  
  const navigate = useNavigate();
  const username = AuthService.getCurrentUser();
  const isAdmin = AuthService.isAdmin();

  // Close dropdown khi click outside
  useClickOutside(dropdownRef, () => {
    setShowUserMenu(false);
  });

  // Banner data
  const banners = [
    {
      id: 1,
      title: "Enjoy The Most Delicious Coffee",
      subtitle: "Start Your Day With Coffee",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
      bgColor: "from-amber-900/80"
    },
    {
      id: 2,
      title: "Special Offer Today",
      subtitle: "Get 20% Off on All Products",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200",
      bgColor: "from-purple-900/80"
    },
    {
      id: 3,
      title: "Fresh Coffee Beans",
      subtitle: "100% Organic & Fair Trade",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200",
      bgColor: "from-green-900/80"
    }
  ];

  useEffect(() => {
    fetchData();
    fetchCartCount();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getAll(),
        CategoryService.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddToCart = async (productId) => {
    if (!AuthService.isAuthenticated()) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login", { state: { from: "/" } });
      return;
    }

    try {
      await CartService.addToCart(productId, 1);
      fetchCartCount();
      alert("✅ Đã thêm vào giỏ hàng!");
    } catch (error) {
      alert("❌ Lỗi: " + (error.data || "Không thể thêm vào giỏ hàng"));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      AuthService.logout();
      navigate("/login");
    }
  };

  const getFilteredProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filters.categoryId);
    }

    filtered = filtered.filter(p => 
      p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    switch (filters.sortBy) {
      case "priceAsc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "nameAZ":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0e0a] via-[#2d1810] to-[#1a0e0a]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3d2415] to-[#1a0e0a] backdrop-blur-lg shadow-2xl sticky top-0 z-50 border-b border-amber-900/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-3 rounded-full shadow-lg">
                <FaCoffee className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Yuu Cafe
                </h1>
                <p className="text-xs text-amber-300/70">Enjoy The Most Delicious Coffee</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <FaSearch className="absolute left-4 top-3.5 text-amber-400/50" />
                <input
                  type="text"
                  placeholder="Search coffee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#3d2415]/50 border border-amber-900/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder-amber-400/30"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {username ? (
                <>
                  <button
                    onClick={() => navigate("/cart")}
                    className="relative flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 px-4 py-2 rounded-lg transition shadow-lg"
                  >
                    <FaShoppingCart className="text-xl" />
                    <span className="font-semibold">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  
                  {/* ✅ User Dropdown Menu với ref */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 bg-[#3d2415] hover:bg-[#4d2815] px-4 py-2 rounded-lg transition border border-amber-900/30"
                    >
                      <FaUser />
                      <span>{username}</span>
                      {isAdmin && (
                        <span className="ml-2 px-2 py-0.5 bg-yellow-600 text-xs rounded-full">
                          ADMIN
                        </span>
                      )}
                    </button>

                    {/* Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-[#3d2415] border border-amber-900/30 rounded-lg shadow-2xl overflow-hidden animate-fadeIn">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-[#4d2815] transition text-left"
                        >
                          <FaUserCircle className="text-amber-400" />
                          <span>Thông tin cá nhân</span>
                        </button>

                        <button
                          onClick={() => {
                            navigate("/my-orders");
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-[#4d2815] transition text-left"
                        >
                          <FaShoppingCart className="text-amber-400" />
                          <span>Đơn hàng của tôi</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              navigate("/admin");
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-yellow-900/30 transition text-left border-t border-amber-900/30"
                          >
                            <FaUserShield className="text-yellow-400" />
                            <span className="text-yellow-400 font-semibold">
                              Quản trị Admin
                            </span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-900/30 transition text-left border-t border-amber-900/30 text-red-400"
                        >
                          <FaSignOutAlt />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 px-6 py-2 rounded-lg transition shadow-lg font-semibold"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Banner Carousel */}
      <section className="relative h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} to-transparent`}></div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl text-white">
                  <h2 className="text-6xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-2xl mb-8 text-amber-200">{banner.subtitle}</p>
                  <button 
                    onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                    className="bg-amber-600 hover:bg-amber-700 px-8 py-4 rounded-lg text-xl font-semibold transition shadow-lg"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full transition text-white"
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <button
          onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full transition text-white"
        >
          <FaChevronRight className="text-xl" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentBanner ? "bg-amber-500 w-8" : "bg-white/50 w-3"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Filters Bar */}
      <div className="bg-[#3d2415]/50 border-b border-amber-900/30 sticky top-[73px] z-40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition"
            >
              <FaFilter />
              <span>Filters</span>
              {showFilters ? <FaTimes className="ml-2" /> : null}
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-amber-300/70">
                Found {filteredProducts.length} products
              </span>
              
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="bg-[#3d2415] text-white border border-amber-900/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAZ">Name: A-Z</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-[#2d1810] rounded-lg border border-amber-900/30 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-amber-300 mb-2 font-semibold">Category</label>
                  <select
                    value={filters.categoryId || ""}
                    onChange={(e) => setFilters({
                      ...filters, 
                      categoryId: e.target.value ? parseInt(e.target.value) : null
                    })}
                    className="w-full bg-[#3d2415] text-white border border-amber-900/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-amber-300 mb-2 font-semibold">
                    Price Range: {filters.minPrice.toLocaleString()} - {filters.maxPrice.toLocaleString()} đ
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({
                        ...filters, 
                        minPrice: Math.min(parseInt(e.target.value), filters.maxPrice - 5000)
                      })}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({
                        ...filters, 
                        maxPrice: Math.max(parseInt(e.target.value), filters.minPrice + 5000)
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilters({
                        categoryId: null,
                        minPrice: 0,
                        maxPrice: 200000,
                        sortBy: "newest"
                      });
                      setSearchTerm("");
                    }}
                    className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded-lg transition border border-red-900/30"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-400">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-gradient-to-br from-[#3d2415] to-[#2d1810] rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-900/50 transition-all duration-300 hover:scale-105 border border-amber-900/20 hover:border-amber-600/50"
              >
                <div 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="relative h-64 overflow-hidden cursor-pointer"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-950">
                      <FaCoffee className="text-amber-400 text-6xl opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-2xl font-bold text-white mb-2 cursor-pointer hover:text-amber-400 transition"
                  >
                    {product.name}
                  </h3>
                  <p className="text-amber-300/50 text-sm mb-4 h-12 overflow-hidden line-clamp-2">
                    {product.description || "A coffee drink typically made from equal parts espresso..."}
                  </p>

                  <div className="flex items-center space-x-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <FaStar key={i} className="text-amber-400 text-xs" />
                    ))}
                    <span className="text-amber-300/70 text-sm ml-2">(4.9)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-amber-400">
                      {product.price?.toLocaleString('vi-VN')} đ
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.quantity > 0 
                        ? 'bg-green-900/30 text-green-400 border border-green-900' 
                        : 'bg-red-900/30 text-red-400 border border-red-900'
                    }`}>
                      {product.quantity > 0 ? `Stock: ${product.quantity}` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-[#4d2815] hover:bg-[#5d3825] text-amber-400 py-2 rounded-lg font-semibold transition text-sm border border-amber-900/30"
                    >
                      More
                    </button>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.quantity === 0}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm shadow-lg"
                    >
                      <FaShoppingCart />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <FaCoffee className="text-6xl text-amber-600/30 mx-auto mb-4" />
            <p className="text-amber-400 text-xl">No products found</p>
            <button
              onClick={() => {
                setFilters({
                  categoryId: null,
                  minPrice: 0,
                  maxPrice: 200000,
                  sortBy: "newest"
                });
                setSearchTerm("");
              }}
              className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-[#3d2415] to-[#1a0e0a] border-t border-amber-900/30 py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-amber-300/50">
            © 2025 YUU Cafe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default UserHome;