package com.movierentalservice.service.impl;

import com.movierentalservice.dto.RatingDto;
import com.movierentalservice.entity.Movie;
import com.movierentalservice.entity.Rating;
import com.movierentalservice.entity.User;
import com.movierentalservice.exception.ResourceNotFoundException;
import com.movierentalservice.repository.MovieRepository;
import com.movierentalservice.repository.RatingRepository;
import com.movierentalservice.repository.UserRepository;
import com.movierentalservice.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    
    @Override
    public RatingDto addRating(Long movieId, RatingDto ratingDto) {
        User user = userRepository.findById(ratingDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ratingDto.getUserId()));
        
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        
        // Check if user has already rated this movie
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndMovieId(user.getId(), movie.getId());
        
        Rating rating;
        if (existingRating.isPresent()) {
            // Update existing rating
            rating = existingRating.get();
            rating.setRating(ratingDto.getRating());
        } else {
            // Create new rating
            rating = Rating.builder()
                    .user(user)
                    .movie(movie)
                    .rating(ratingDto.getRating())
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        
        Rating savedRating = ratingRepository.save(rating);
        
        return mapToDto(savedRating);
    }
    
    @Override
    public List<RatingDto> getMovieRatings(Long movieId) {
        // Check if movie exists
        movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        
        List<Rating> ratings = ratingRepository.findByMovieId(movieId);
        
        return ratings.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RatingDto> getUserRatings(Long userId) {
        // Check if user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        List<Rating> ratings = ratingRepository.findByUserId(userId);
        
        return ratings.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Double getAverageRating(Long movieId) {
        // Check if movie exists
        movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        
        return ratingRepository.getAverageRatingForMovie(movieId);
    }
    
    private RatingDto mapToDto(Rating rating) {
        return RatingDto.builder()
                .id(rating.getId())
                .userId(rating.getUser().getId())
                .userFullName(rating.getUser().getFullName())
                .movieId(rating.getMovie().getId())
                .rating(rating.getRating())
                .createdAt(rating.getCreatedAt())
                .build();
    }
} 