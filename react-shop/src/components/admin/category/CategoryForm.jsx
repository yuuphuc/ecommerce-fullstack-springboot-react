import React, { useState, useEffect } from "react";
import CategoryService from "../../../services/CategoryService";
import { FaSave, FaTimes } from "react-icons/fa";

function CategoryForm({ category, onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
    } else {
      setName("");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let savedCategory;
      
      if (category) {
        savedCategory = await CategoryService.update(category.id, { name });
      } else {
        savedCategory = await CategoryService.create({ name });
      }

      // ✅ Callback - KHÔNG reload
      onSuccess(savedCategory);
      setName("");
    } catch (error) {
      setErrorMsg(
        error.status ? `Lỗi ${error.status}: ${error.data}` : "Lỗi khi lưu danh mục"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600 transition"
          placeholder="Nhập tên danh mục"
          required
        />
      </div>

      <div className="flex space-x-4 pt-4 border-t border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSave />
          <span>{loading ? "Đang lưu..." : category ? "Cập nhật" : "Thêm mới"}</span>
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-6 rounded-lg font-semibold transition"
        >
          <FaTimes />
          <span>Hủy</span>
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;