package com.example.demo.assembler;

import com.example.demo.controller.OrderController;
import com.example.demo.dto.OrderDto;

import org.springframework.lang.NonNull;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class OrderModelAssembler implements RepresentationModelAssembler<OrderDto, EntityModel<OrderDto>> {

    @Override
    @NonNull
    public EntityModel<OrderDto> toModel(@NonNull OrderDto order) {
        EntityModel<OrderDto> orderModel = EntityModel.of(order);

        orderModel.add(linkTo(methodOn(OrderController.class)
                .getOrderById(order.getId(), null))
                .withSelfRel());

        orderModel.add(linkTo(methodOn(OrderController.class)
                .getMyOrders(null))
                .withRel("my-orders"));

        orderModel.add(linkTo(methodOn(OrderController.class)
                .getAllOrders())
                .withRel("all-orders"));

        // Link cancel nếu order đang PENDING
        if ("PENDING".equals(order.getStatus())) {
            orderModel.add(linkTo(methodOn(OrderController.class)
                    .cancelOrder(order.getId(), null))
                    .withRel("cancel"));
        }

        return orderModel;
    }
}