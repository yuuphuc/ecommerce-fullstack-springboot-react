package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateCartItemRequest {
    
    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    @Max(value = 9999, message = "Số lượng không được vượt quá 9999")
    private Integer quantity;
}