package com.example.demo.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private String orderCode;
    private Long userId;
    private String username;
    private List<OrderItemDto> items;
    private Double totalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}