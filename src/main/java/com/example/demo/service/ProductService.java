package com.example.demo.service;

import java.util.List;
import com.example.demo.dto.ProductDto;

// Service: chỉ định nghĩa các chức năng cần có (chưa viết logic)
public interface ProductService {
    ProductDto addProduct(ProductDto productDto);
    List<ProductDto> getAllProducts();
    ProductDto getProductById(Integer id);
    ProductDto updateProduct(Integer id, ProductDto productDto);
    void deleteProduct(Integer id);
    // 🔍 Truy vấn nâng cao
    List<ProductDto> findByName(String keyword);        // Tìm theo tên
    List<ProductDto> findByPriceRange(Double min, Double max); // Lọc theo giá
    List<ProductDto> findByCategory(Integer categoryId);        // Lọc theo danh mục
}
