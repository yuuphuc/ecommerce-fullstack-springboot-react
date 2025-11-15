package com.example.demo.mapper;

import com.example.demo.dto.ProductDto;
import com.example.demo.entity.Product;
import com.example.demo.entity.Category;

public class ProductMapper {

    public static ProductDto toDto(Product p) {
        if (p == null) return null;
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .quantity(p.getQuantity())
                .imageUrl(p.getImageUrl())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .build();
    }

    public static Product toEntity(ProductDto d) {
        if (d == null) return null;

        Product product = Product.builder()
                .id(d.getId())
                .name(d.getName())
                .description(d.getDescription())
                .price(d.getPrice())
                .quantity(d.getQuantity())
                .imageUrl(d.getImageUrl())
                .build();

        if (d.getCategoryId() != null) {
            Category category = new Category();
            category.setId(d.getCategoryId());
            product.setCategory(category);
        }

        return product;
    }
}