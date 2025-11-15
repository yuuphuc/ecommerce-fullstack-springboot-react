package com.example.demo.controller;

import com.example.demo.assembler.CategoryModelAssembler;
import com.example.demo.dto.CategoryDto;
import com.example.demo.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryModelAssembler assembler;

    @GetMapping
    public CollectionModel<EntityModel<CategoryDto>> getAll() {
        List<EntityModel<CategoryDto>> categories = categoryService.getAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(categories,
                linkTo(methodOn(CategoryController.class).getAll()).withSelfRel());
    }

    @GetMapping("/{id}")
    public EntityModel<CategoryDto> getById(@PathVariable Integer id) {
        CategoryDto category = categoryService.getById(id);
        return assembler.toModel(category);
    }

    @PostMapping
    public ResponseEntity<EntityModel<CategoryDto>> create(@Valid @RequestBody CategoryDto dto) {
        CategoryDto saved = categoryService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(assembler.toModel(saved));
    }

    @PutMapping("/{id}")
    public EntityModel<CategoryDto> update(
            @PathVariable Integer id, 
            @Valid @RequestBody CategoryDto dto) {
        CategoryDto updated = categoryService.update(id, dto);
        return assembler.toModel(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        categoryService.delete(id);
        return ResponseEntity.ok("✅ Category deleted successfully");
    }
}