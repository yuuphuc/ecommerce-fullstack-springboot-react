package com.example.demo.controller;

import com.example.demo.assembler.OrderModelAssembler;
import com.example.demo.dto.*;
import com.example.demo.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderModelAssembler assembler;

    @PostMapping
    public ResponseEntity<EntityModel<OrderDto>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication auth) {
        String username = auth.getName();
        OrderDto order = orderService.createOrder(username, request);
        return ResponseEntity.ok(assembler.toModel(order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<CollectionModel<EntityModel<OrderDto>>> getMyOrders(Authentication auth) {
        String username = auth.getName();
        List<EntityModel<OrderDto>> orders = orderService.getOrdersByUsername(username).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(orders,
                linkTo(methodOn(OrderController.class).getMyOrders(auth)).withSelfRel()));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<EntityModel<OrderDto>> getOrderById(
            @PathVariable Long orderId,
            Authentication auth) {
        String username = auth.getName();
        OrderDto order = orderService.getOrderById(orderId, username);
        return ResponseEntity.ok(assembler.toModel(order));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<EntityModel<OrderDto>> cancelOrder(
            @PathVariable Long orderId,
            Authentication auth) {
        String username = auth.getName();
        OrderDto order = orderService.cancelOrder(orderId, username);
        return ResponseEntity.ok(assembler.toModel(order));
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<OrderDto>>> getAllOrders() {
        List<EntityModel<OrderDto>> orders = orderService.getAllOrders().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(orders,
                linkTo(methodOn(OrderController.class).getAllOrders()).withSelfRel()));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<EntityModel<OrderDto>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderDto order = orderService.updateOrderStatus(orderId, request.getStatus());
        return ResponseEntity.ok(assembler.toModel(order));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("✅ Đơn hàng đã được xóa");
    }
}