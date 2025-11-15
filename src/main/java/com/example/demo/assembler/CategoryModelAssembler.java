package com.example.demo.assembler;

import com.example.demo.controller.CategoryController;
import com.example.demo.controller.ProductController;
import com.example.demo.dto.CategoryDto;

import org.springframework.lang.NonNull;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class CategoryModelAssembler implements RepresentationModelAssembler<CategoryDto, EntityModel<CategoryDto>> {

    @Override
    @NonNull
    public EntityModel<CategoryDto> toModel(@NonNull CategoryDto category) {
        EntityModel<CategoryDto> categoryModel = EntityModel.of(category);

        categoryModel.add(linkTo(methodOn(CategoryController.class)
                .getById(category.getId()))
                .withSelfRel());

        categoryModel.add(linkTo(methodOn(CategoryController.class)
                .getAll())
                .withRel("all-categories"));

        categoryModel.add(linkTo(methodOn(ProductController.class)
                .findByCategory(category.getId()))
                .withRel("products"));

        return categoryModel;
    }
}