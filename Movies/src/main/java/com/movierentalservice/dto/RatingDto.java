package com.movierentalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingDto {
    private Long id;
    private Long userId;
    private String userFullName;
    private Long movieId;
    private Integer rating; // 1-5 stars
    private LocalDateTime createdAt;
} 