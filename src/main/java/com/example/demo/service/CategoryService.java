package com.example.demo.service;

import com.example.demo.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAll();
    CategoryDto getById(Integer id);
    CategoryDto create(CategoryDto dto);
    CategoryDto update(Integer id, CategoryDto dto);
    void delete(Integer id);
}
