package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String paymentMethod; // String: "COD", "BANK_TRANSFER", "VNPAY", "MOMO"
    private String note;
    private List<OrderItemRequest> items; // Danh sách sản phẩm
}

// DTO cho item trong đơn hàng
@Data
class OrderItemRequest {
    private Integer productId;
    private Integer quantity;
}