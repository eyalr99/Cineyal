package com.movierentalservice.service;

import java.util.List;

import com.movierentalservice.dto.MovieDto;

public interface MovieService {
    
    List<MovieDto> getAllMovies();
    
    MovieDto getMovieById(Long movieId);
    
    List<MovieDto> searchMovies(String category, Integer year, Double rating, String search);
    
    List<MovieDto> getAvailableMovies();
} 