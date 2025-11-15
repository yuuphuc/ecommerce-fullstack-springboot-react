import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaList, FaPlus, FaTimes } from "react-icons/fa";
import CategoryService from "../../../services/CategoryService";
import CategoryForm from "./CategoryForm";

function List() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.status ? `Lỗi ${error.status}: ${error.data}` : "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    
    try {
      await CategoryService.delete(id);
      // ✅ Cập nhật state - KHÔNG reload
      setCategories(categories.filter(c => c.id !== id));
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.status ? `Lỗi ${error.status}: ${error.data}` : "Lỗi xóa danh mục");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleSuccess = (savedCategory) => {
    if (editingCategory) {
      // ✅ Update - KHÔNG reload
      setCategories(categories.map(c => c.id === savedCategory.id ? savedCategory : c));
    } else {
      // ✅ Add new - KHÔNG reload
      setCategories([...categories, savedCategory]);
    }
    setShowForm(false);
    setEditingCategory(null);
    setErrorMsg("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 p-3 rounded-lg">
            <FaList className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Quản lý danh mục</h2>
            <p className="text-gray-400 text-sm">Danh sách tất cả danh mục</p>
          </div>
        </div>
        
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg transition shadow-lg text-white font-semibold"
        >
          <FaPlus />
          <span>Thêm danh mục</span>
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

      {/* Form Add/Edit */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <FaList className="text-purple-400" />
              <span>{editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}</span>
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white text-2xl transition"
            >
              <FaTimes />
            </button>
          </div>
          <CategoryForm 
            category={editingCategory} 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      ) : (
        /* Category Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
              <FaList className="text-5xl mx-auto mb-4 opacity-30 text-gray-500" />
              <p className="text-lg text-gray-400">Chưa có danh mục nào</p>
              <p className="text-sm mt-2 text-gray-500">Nhấn nút "Thêm danh mục" để bắt đầu</p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-200 hover:shadow-2xl group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-semibold text-gray-500">
                        ID: #{category.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition">
                      {category.name}
                    </h3>
                  </div>
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <FaList className="text-white" />
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition text-sm font-medium"
                  >
                    <FaEdit />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition text-sm font-medium"
                  >
                    <FaTrashAlt />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default List;