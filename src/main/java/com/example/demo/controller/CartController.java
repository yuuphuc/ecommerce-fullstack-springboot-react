package com.example.demo.controller;

import com.example.demo.assembler.CartModelAssembler;
import com.example.demo.dto.*;
import com.example.demo.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CartModelAssembler assembler;

    @GetMapping
    public ResponseEntity<EntityModel<CartDto>> getMyCart(Authentication auth) {
        String username = auth.getName();
        CartDto cart = cartService.getCartByUsername(username);
        return ResponseEntity.ok(assembler.toModel(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<EntityModel<CartDto>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication auth) {
        String username = auth.getName();
        CartDto cart = cartService.addToCart(username, request);
        return ResponseEntity.ok(assembler.toModel(cart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<EntityModel<CartDto>> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            Authentication auth) {
        String username = auth.getName();
        CartDto cart = cartService.updateCartItem(username, itemId, request.getQuantity());
        return ResponseEntity.ok(assembler.toModel(cart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<EntityModel<CartDto>> removeCartItem(
            @PathVariable Long itemId,
            Authentication auth) {
        String username = auth.getName();
        CartDto cart = cartService.removeCartItem(username, itemId);
        return ResponseEntity.ok(assembler.toModel(cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(Authentication auth) {
        String username = auth.getName();
        cartService.clearCart(username);
        return ResponseEntity.ok("✅ Giỏ hàng đã được xóa");
    }
}