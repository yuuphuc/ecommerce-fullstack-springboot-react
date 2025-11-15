package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ExcelController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * EXPORT Products ra Excel (1 sheet)
     */
    @GetMapping("/export/products")
    public ResponseEntity<Resource> exportProducts() {
        String filename = "products.xlsx";
        List<Product> products = productRepository.findAll();
        ByteArrayInputStream in = ExcelHelper.productsToExcel(products);

        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    /**
     * EXPORT Products + Categories ra Excel (2 sheets) - NÂNG CAO
     */
    @GetMapping("/export/all")
    public ResponseEntity<Resource> exportAll() {
        String filename = "products-and-categories.xlsx";
        List<Product> products = productRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        ByteArrayInputStream in = ExcelHelper.productsAndCategoriesToExcel(products, categories);

        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    /**
     * IMPORT Products từ Excel
     */
    @PostMapping("/import/products")
    public ResponseEntity<Map<String, Object>> importProducts(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        if (!ExcelHelper.hasExcelFormat(file)) {
            response.put("message", "Please upload an Excel file!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            List<Product> products = ExcelHelper.excelToProducts(file.getInputStream());
            
            // Lưu vào database
            productRepository.saveAll(products);

            response.put("message", "Uploaded the file successfully: " + file.getOriginalFilename());
            response.put("count", products.size());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("message", "Could not upload the file: " + file.getOriginalFilename() + "!");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(response);
        }
    }
}