package com.movierentalservice.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.movierentalservice.dto.MovieDto;
import com.movierentalservice.entity.Actor;
import com.movierentalservice.entity.Category;
import com.movierentalservice.entity.Movie;
import com.movierentalservice.exception.ResourceNotFoundException;
import com.movierentalservice.repository.MovieRepository;
import com.movierentalservice.repository.RatingRepository;
import com.movierentalservice.service.MovieService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    
    private final MovieRepository movieRepository;
    private final RatingRepository ratingRepository;
    
    @Override
    public List<MovieDto> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public MovieDto getMovieById(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        
        return mapToDto(movie);
    }
    
    @Override
    public List<MovieDto> searchMovies(String category, Integer year, Double rating, String search) {
        List<Movie> movies = movieRepository.findAll();
        
        if (category != null && !category.isEmpty()) {
            movies = movies.stream()
                    .filter(movie -> movie.getCategories().stream()
                            .anyMatch(c -> c.getName().equalsIgnoreCase(category)))
                    .collect(Collectors.toList());
        }
        
        if (year != null) {
            movies = movies.stream()
                    .filter(movie -> movie.getReleaseYear().equals(year))
                    .collect(Collectors.toList());
        }
        
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            movies = movies.stream()
                    .filter(movie -> 
                        movie.getTitle().toLowerCase().contains(searchLower) ||
                        movie.getDescription().toLowerCase().contains(searchLower) ||
                        movie.getDirector().toLowerCase().contains(searchLower))
                    .collect(Collectors.toList());
        }
        
        if (rating != null) {
            movies = movies.stream()
                    .filter(movie -> {
                        Double avgRating = ratingRepository.getAverageRatingForMovie(movie.getId());
                        return avgRating != null && avgRating >= rating;
                    })
                    .collect(Collectors.toList());
        }
        
        return movies.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MovieDto> getAvailableMovies() {
        List<Movie> availableMovies = movieRepository.findAvailableMovies();
        return availableMovies.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    private MovieDto mapToDto(Movie movie) {
        return MovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .releaseYear(movie.getReleaseYear())
                .director(movie.getDirector())
                .duration(movie.getDuration())
                .imageId(movie.getImageId())
                .actors(movie.getActors().stream()
                        .map(Actor::getName)
                        .collect(Collectors.toList()))
                .categories(movie.getCategories().stream()
                        .map(Category::getName)
                        .collect(Collectors.toList()))
                .averageRating(movie.getAverageRating())
                .stockQuantity(movie.getStockQuantity())
                .available(movie.isAvailable())
                .build();
    }
} 