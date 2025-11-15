package com.example.demo.service.impl;

import com.example.demo.dto.ProductDto;
import com.example.demo.entity.Product;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductService;
import com.example.demo.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    // Constructor Injection
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductDto addProduct(ProductDto productDto) {
        Product saved = productRepository.save(ProductMapper.toEntity(productDto));
        return ProductMapper.toDto(saved);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Integer id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id: " + id));
        return ProductMapper.toDto(p);
    }

    @Override
    public ProductDto updateProduct(Integer id, ProductDto productDto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id: " + id));

        existing.setName(productDto.getName());
        existing.setDescription(productDto.getDescription());
        existing.setPrice(productDto.getPrice());
        existing.setQuantity(productDto.getQuantity());
        existing.setImageUrl(productDto.getImageUrl());

        return ProductMapper.toDto(productRepository.save(existing));
    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm có id: " + id);
        }
        productRepository.deleteById(id);
    }

    // Tìm theo tên
    @Override
    public List<ProductDto> findByName(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    // Lọc theo khoảng giá
    @Override
    public List<ProductDto> findByPriceRange(Double min, Double max) {
        return productRepository.findByPriceBetween(min, max)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    // Lọc theo Category ID
    @Override
    public List<ProductDto> findByCategory(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }
}
