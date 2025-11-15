package com.example.demo.controller;

import com.example.demo.assembler.ProductModelAssembler;
import com.example.demo.dto.ProductDto;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;
    private final ProductModelAssembler assembler;

    @GetMapping
    public CollectionModel<EntityModel<ProductDto>> getAllProducts() {
        List<EntityModel<ProductDto>> products = service.getAllProducts().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(products,
                linkTo(methodOn(ProductController.class).getAllProducts()).withSelfRel());
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductDto productDto, BindingResult result) {
        // Kiểm tra validation errors
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Validation failed");
            response.put("errors", errors);
            
            return ResponseEntity.badRequest().body(response);
        }

        ProductDto saved = service.addProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(assembler.toModel(saved));
    }

    @GetMapping("/{id}")
    public EntityModel<ProductDto> getProductById(@PathVariable Integer id) {
        ProductDto product = service.getProductById(id);
        return assembler.toModel(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Integer id, 
            @Valid @RequestBody ProductDto productDto, 
            BindingResult result) {
        
        // Kiểm tra validation errors
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Validation failed");
            response.put("errors", errors);
            
            return ResponseEntity.badRequest().body(response);
        }

        ProductDto updated = service.updateProduct(id, productDto);
        return ResponseEntity.ok(assembler.toModel(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Integer id) {
        service.deleteProduct(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Product deleted successfully");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public CollectionModel<EntityModel<ProductDto>> findByName(@RequestParam("name") String name) {
        List<EntityModel<ProductDto>> products = service.findByName(name).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(products,
                linkTo(methodOn(ProductController.class).findByName(name)).withSelfRel(),
                linkTo(methodOn(ProductController.class).getAllProducts()).withRel("all-products"));
    }

    @GetMapping("/price")
    public CollectionModel<EntityModel<ProductDto>> findByPriceRange(
            @RequestParam("min") Double minPrice, 
            @RequestParam("max") Double maxPrice) {
        
        // Validate giá
        if (minPrice < 0 || maxPrice < 0) {
            throw new IllegalArgumentException("Giá không được âm");
        }
        if (minPrice > maxPrice) {
            throw new IllegalArgumentException("Giá tối thiểu không được lớn hơn giá tối đa");
        }
        
        List<EntityModel<ProductDto>> products = service.findByPriceRange(minPrice, maxPrice).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(products,
                linkTo(methodOn(ProductController.class).findByPriceRange(minPrice, maxPrice)).withSelfRel(),
                linkTo(methodOn(ProductController.class).getAllProducts()).withRel("all-products"));
    }

    @GetMapping("/category/{id}")
    public CollectionModel<EntityModel<ProductDto>> findByCategory(@PathVariable("id") Integer categoryId) {
        // Validate category ID
        if (categoryId <= 0) {
            throw new IllegalArgumentException("Category ID phải lớn hơn 0");
        }
        
        List<EntityModel<ProductDto>> products = service.findByCategory(categoryId).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(products,
                linkTo(methodOn(ProductController.class).findByCategory(categoryId)).withSelfRel(),
                linkTo(methodOn(ProductController.class).getAllProducts()).withRel("all-products"));
    }
}