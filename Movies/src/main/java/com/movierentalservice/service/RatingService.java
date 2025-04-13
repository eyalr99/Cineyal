package com.movierentalservice.service;

import com.movierentalservice.dto.RatingDto;

import java.util.List;

public interface RatingService {
    
    RatingDto addRating(Long movieId, RatingDto ratingDto);
    
    List<RatingDto> getMovieRatings(Long movieId);
    
    List<RatingDto> getUserRatings(Long userId);
    
    Double getAverageRating(Long movieId);
} 