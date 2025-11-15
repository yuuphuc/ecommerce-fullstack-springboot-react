package com.example.demo.service;

import com.example.demo.dto.*;
import java.util.List;

public interface OrderService {
    OrderDto createOrder(String username, CreateOrderRequest request);
    List<OrderDto> getOrdersByUsername(String username);
    OrderDto getOrderById(Long orderId, String username);
    OrderDto cancelOrder(Long orderId, String username);
    List<OrderDto> getAllOrders();
    OrderDto updateOrderStatus(Long orderId, String status);
    void deleteOrder(Long orderId);
}
