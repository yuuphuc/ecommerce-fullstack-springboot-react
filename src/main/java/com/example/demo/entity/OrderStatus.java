package com.example.demo.entity;

public enum OrderStatus {
    PENDING,      // Chờ xác nhận
    CONFIRMED,    // Đã xác nhận
    PROCESSING,   // Đang xử lý
    SHIPPING,     // Đang giao
    DELIVERED,    // Đã giao
    CANCELLED     // Đã hủy
}