// src/components/admin/product/ProductForm.jsx
import React, { useState, useEffect } from "react";
import ProductService from "../../../services/ProductService";
import ImageService from "../../../services/ImageService";
import { FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { FieldError, ValidationErrors } from "../../FormValidation";

function ProductForm({ product, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: 1,
    imageUrl: "",
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "",
        categoryId: product.categoryId || 1,
        imageUrl: product.imageUrl || "",
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: 1,
        imageUrl: "",
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setErrors({});
  }, [product]);

  // Validate client-side
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Tên sản phẩm không được để trống";
    } else if (formData.name.length < 3) {
      newErrors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
    } else if (formData.name.length > 200) {
      newErrors.name = "Tên sản phẩm không được quá 200 ký tự";
    }

    // Description validation
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Mô tả không được quá 1000 ký tự";
    }

    // Price validation
    if (!formData.price || formData.price === "") {
      newErrors.price = "Giá không được để trống";
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = "Giá phải lớn hơn 0";
      } else if (priceNum > 999999999.99) {
        newErrors.price = "Giá không được vượt quá 999,999,999.99";
      }
    }

    // Quantity validation
    if (!formData.quantity && formData.quantity !== 0) {
      newErrors.quantity = "Số lượng không được để trống";
    } else {
      const qtyNum = parseInt(formData.quantity);
      if (isNaN(qtyNum) || qtyNum < 0) {
        newErrors.quantity = "Số lượng không được âm";
      } else if (qtyNum > 999999) {
        newErrors.quantity = "Số lượng không được vượt quá 999,999";
      }
    }

    // Category validation
    if (!formData.categoryId || formData.categoryId < 1) {
      newErrors.categoryId = "Vui lòng chọn danh mục hợp lệ";
    }

    // Image URL validation (nếu có)
    if (formData.imageUrl && !formData.imageUrl.match(/^(https?:\/\/|data:image\/)/)) {
      newErrors.imageUrl = "URL ảnh không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error khi user nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, imageFile: "Kích thước ảnh không được vượt quá 5MB" });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, imageFile: "File phải là ảnh" });
        return;
      }

      setImageFile(file);
      setErrors({ ...errors, imageFile: "" });
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate trước khi submit
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload image nếu có file mới
      if (imageFile) {
        setUploading(true);
        try {
          imageUrl = await ImageService.uploadImageToCloudinary(imageFile);
          console.log("✅ Image uploaded:", imageUrl);
        } catch (uploadError) {
          setErrors({ ...errors, imageFile: "Lỗi upload ảnh: " + uploadError.message });
          setLoading(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      // Save product với imageUrl
      const productData = {
        ...formData,
        imageUrl: imageUrl,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: parseInt(formData.categoryId)
      };

      console.log("📤 Sending product data:", productData);

      let savedProduct;
      if (product) {
        savedProduct = await ProductService.update(product.id, productData);
      } else {
        savedProduct = await ProductService.create(productData);
      }

      if (!savedProduct || !savedProduct.id) {
        throw new Error("Invalid product response from server");
      }

      onSuccess(savedProduct);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: 1,
        imageUrl: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setErrors({});
      
    } catch (error) {
      console.error("❌ Submit error:", error);
      
      // ✅ Xử lý lỗi từ backend
      if (error.response?.data?.errors) {
        // Backend trả về validation errors
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.status 
            ? `Lỗi ${error.status}: ${error.data}` 
            : "Lỗi khi lưu sản phẩm: " + error.message
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hiển thị validation errors */}
      <ValidationErrors errors={errors} />

      {/* Image Upload */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Hình ảnh sản phẩm
        </label>

        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upload File */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Upload file:</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg cursor-pointer transition"
              >
                <FaUpload />
                <span>{imageFile ? imageFile.name : "Chọn ảnh"}</span>
              </label>
            </div>
            <FieldError error={errors.imageFile} />
          </div>

          {/* Hoặc paste URL */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Hoặc paste URL:</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 ${
                errors.imageUrl ? 'border-2 border-red-500' : 'focus:ring-indigo-500'
              }`}
              placeholder="https://..."
            />
            <FieldError error={errors.imageUrl} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tên sản phẩm */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 border transition ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-indigo-500'
            }`}
            placeholder="Nhập tên sản phẩm"
          />
          <FieldError error={errors.name} />
        </div>

        {/* Giá */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Giá <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 border transition ${
              errors.price 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-indigo-500'
            }`}
            placeholder="Nhập giá (VNĐ)"
            min="0"
            step="1000"
          />
          <FieldError error={errors.price} />
        </div>

        {/* Số lượng */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Số lượng <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 border transition ${
              errors.quantity 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-indigo-500'
            }`}
            placeholder="Nhập số lượng"
            min="0"
          />
          <FieldError error={errors.quantity} />
        </div>

        {/* Category ID */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 border transition ${
              errors.categoryId 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-indigo-500'
            }`}
            placeholder="Nhập category ID"
            min="1"
          />
          <FieldError error={errors.categoryId} />
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Mô tả sản phẩm
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 border transition resize-none ${
            errors.description 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-600 focus:ring-indigo-500'
          }`}
          placeholder="Nhập mô tả chi tiết về sản phẩm..."
          rows="4"
        />
        <FieldError error={errors.description} />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4 border-t border-gray-700">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSave />
          <span>
            {uploading ? "Đang upload ảnh..." : loading ? "Đang lưu..." : product ? "Cập nhật" : "Thêm mới"}
          </span>
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading || uploading}
          className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-6 rounded-lg font-semibold transition disabled:opacity-50"
        >
          <FaTimes />
          <span>Hủy</span>
        </button>
      </div>
    </form>
  );
}

export default ProductForm;