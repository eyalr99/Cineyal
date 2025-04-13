package com.movierentalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {
    private Long id;
    private String title;
    private String description;
    private Integer releaseYear;
    private String director;
    private Integer duration;
    private String imageId;
    private List<String> actors;
    private List<String> categories;
    private Double averageRating;
    private Integer stockQuantity;
    private boolean available;
} 