package com.example.demo.assembler;

import com.example.demo.controller.CartController;
import com.example.demo.controller.OrderController;
import com.example.demo.dto.CartDto;

import org.springframework.lang.NonNull;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class CartModelAssembler implements RepresentationModelAssembler<CartDto, EntityModel<CartDto>> {

    @Override
    @NonNull
    public EntityModel<CartDto> toModel(@NonNull CartDto cart) {
        EntityModel<CartDto> cartModel = EntityModel.of(cart);

        cartModel.add(linkTo(methodOn(CartController.class)
                .getMyCart(null))
                .withSelfRel());

        cartModel.add(linkTo(methodOn(CartController.class)
                .clearCart(null))
                .withRel("clear-cart"));

        // Link to checkout
        if (cart.getTotalItems() != null && cart.getTotalItems() > 0) {
            cartModel.add(linkTo(methodOn(OrderController.class)
                    .createOrder(null, null))
                    .withRel("checkout"));
        }

        return cartModel;
    }
}