package com.example.demo.service;

import com.example.demo.dto.AddToCartRequest;
import com.example.demo.dto.CartDto;

public interface CartService {
    CartDto getCartByUsername(String username);
    CartDto addToCart(String username, AddToCartRequest request);
    CartDto updateCartItem(String username, Long itemId, Integer quantity);
    CartDto removeCartItem(String username, Long itemId);
    void clearCart(String username);
}