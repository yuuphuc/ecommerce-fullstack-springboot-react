package com.example.demo.assembler;

import com.example.demo.controller.CategoryController;
import com.example.demo.controller.ProductController;
import com.example.demo.dto.ProductDto;

import org.springframework.lang.NonNull;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class ProductModelAssembler implements RepresentationModelAssembler<ProductDto, EntityModel<ProductDto>> {

    @Override
    @NonNull
    public EntityModel<ProductDto> toModel(@NonNull ProductDto product) {
        EntityModel<ProductDto> productModel = EntityModel.of(product);

        productModel.add(linkTo(methodOn(ProductController.class)
                .getProductById(product.getId()))
                .withSelfRel());

        productModel.add(linkTo(methodOn(ProductController.class)
                .getAllProducts())
                .withRel("all-products"));

        if (product.getCategoryId() != null) {
            productModel.add(linkTo(methodOn(CategoryController.class)
                    .getById(product.getCategoryId()))
                    .withRel("category"));

            productModel.add(linkTo(methodOn(ProductController.class)
                    .findByCategory(product.getCategoryId()))
                    .withRel("related-products"));
        }

        return productModel;
    }
}