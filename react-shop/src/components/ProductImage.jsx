// src/components/ProductImage.jsx
import React from "react";
import { FaBoxOpen } from "react-icons/fa";

function ProductImage({ imageUrl, alt, className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback nếu ảnh lỗi
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      {/* Fallback icon */}
      <div 
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 ${imageUrl ? 'hidden' : 'flex'}`}
        style={{ display: imageUrl ? 'none' : 'flex' }}
      >
        <FaBoxOpen className="text-white text-6xl opacity-50" />
      </div>
    </div>
  );
}

export default ProductImage;
