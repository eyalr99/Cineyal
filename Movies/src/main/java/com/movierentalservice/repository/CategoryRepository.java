package com.movierentalservice.repository;

import com.movierentalservice.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    boolean existsByNameIgnoreCase(String name);

    List<Category> findByNameContainingIgnoreCase(String name);
} 