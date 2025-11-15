import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaBoxOpen, FaPlus, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductService from "../../../services/ProductService";
import ProductForm from "./ProductForm";

function List() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.status ? `Lỗi ${error.status}: ${error.data}` : "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await ProductService.delete(id);
      setProducts(products.filter(p => p.id !== id));
      setErrorMsg("");

      // Điều chỉnh trang nếu trang hiện tại trống sau khi xóa
      const newTotalPages = Math.ceil((products.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      setErrorMsg(error.status ? `Lỗi ${error.status}: ${error.data}` : "Lỗi xóa sản phẩm");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleSuccess = (savedProduct) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      setSuccessMsg("Cập nhật sản phẩm thành công!");
    } else {
      setProducts([...products, savedProduct]);
      setSuccessMsg("Thêm sản phẩm thành công!");
    }

    setShowForm(false);
    setEditingProduct(null);
    setErrorMsg("");

    // Ẩn thông báo sau 3 giây
    setTimeout(() => setSuccessMsg(""), 3000);
  };


  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Tính toán pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Chuyển trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Thay đổi số lượng hiển thị
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset về trang 1
  };

  // Tạo array số trang
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <FaBoxOpen className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Quản lý sản phẩm</h2>
            <p className="text-gray-400 text-sm">
              Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, products.length)} / {products.length} sản phẩm
            </p>
          </div>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg transition shadow-lg text-white font-semibold"
        >
          <FaPlus />
          <span>Thêm sản phẩm</span>
        </button>
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
      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-600/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="text-green-300 hover:text-white">
            <FaTimes />
          </button>
        </div>
      )}
      {/* Form Add/Edit */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <FaBoxOpen className="text-indigo-400" />
              <span>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</span>
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white text-2xl transition"
            >
              <FaTimes />
            </button>
          </div>
          <ProductForm
            product={editingProduct}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Items per page selector */}
      <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-3">
          <label className="text-gray-300 text-sm font-medium">Hiển thị:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5}>5 sản phẩm</option>
            <option value={10}>10 sản phẩm</option>
            <option value={20}>20 sản phẩm</option>
            <option value={50}>50 sản phẩm</option>
            <option value={100}>100 sản phẩm</option>
          </select>
        </div>

        <div className="text-gray-400 text-sm">
          Trang {currentPage} / {totalPages || 1}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      ) : (
        /* Product Table */
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-700 border-b border-gray-600">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      <FaBoxOpen className="text-5xl mx-auto mb-4 opacity-30" />
                      <p className="text-lg">Chưa có sản phẩm nào</p>
                      <p className="text-sm mt-2">Nhấn nút "Thêm sản phẩm" để bắt đầu</p>
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        #{p.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{p.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400 max-w-xs truncate">
                          {p.description || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-400">
                          {p.price?.toLocaleString('vi-VN')} đ
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${p.quantity > 0
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-red-900/30 text-red-400'
                          }`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-indigo-400 hover:text-indigo-300 transition text-lg p-2 hover:bg-indigo-900/30 rounded"
                            title="Sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:text-red-400 transition text-lg p-2 hover:bg-red-900/30 rounded"
                            title="Xóa"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
          {/* Previous Button */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${currentPage === 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            <FaChevronLeft />
            <span>Trước</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === page
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${currentPage === totalPages
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            <span>Sau</span>
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default List;