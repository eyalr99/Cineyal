package com.movierentalservice.service;

import com.movierentalservice.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    
    /**
     * Get all categories from the database
     *
     * @return a list of all categories
     */
    List<CategoryDto> getAllCategories();
} 