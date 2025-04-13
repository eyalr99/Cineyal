package com.movierentalservice.controller;

import java.io.IOException;
import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.movierentalservice.dto.MovieDto;
import com.movierentalservice.dto.RatingDto;
import com.movierentalservice.service.ImageService;
import com.movierentalservice.service.MovieService;
import com.movierentalservice.service.RatingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@Slf4j
public class MovieController {

    private final MovieService movieService;
    private final RatingService ratingService;
    private final ImageService imageService;


    @GetMapping
    public ResponseEntity<List<MovieDto>> getAllMovies(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) String search) {
        
        List<MovieDto> movies = movieService.searchMovies(category, year, rating, search);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<MovieDto> getMovieDetails(@PathVariable Long movieId) {
        MovieDto movie = movieService.getMovieById(movieId);
        return ResponseEntity.ok(movie);
    }

    @PostMapping("/{movieId}/ratings")
    public ResponseEntity<RatingDto> rateMovie(
            @PathVariable Long movieId,
            @RequestBody RatingDto ratingDto) {
        RatingDto savedRating = ratingService.addRating(movieId, ratingDto);
        return ResponseEntity.ok(savedRating);
    }

    @GetMapping("images/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageId) {
        try {
            byte[] imageData = imageService.getImage(imageId);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageData);
        } catch (IOException e) {
            log.error("Error retrieving image with id: {}", imageId, e);
            return ResponseEntity.notFound().build();
        }
    }
} 