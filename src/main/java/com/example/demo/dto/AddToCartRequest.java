package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddToCartRequest {
    
    @NotNull(message = "Product ID không được để trống")
    @Min(value = 1, message = "Product ID phải lớn hơn 0")
    private Long productId;
    
    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải ít nhất là 1")
    @Max(value = 9999, message = "Số lượng không được vượt quá 9999")
    private Integer quantity;
}