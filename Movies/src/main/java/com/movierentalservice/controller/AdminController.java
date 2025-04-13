package com.movierentalservice.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.movierentalservice.dto.ImageUploadResponseDto;
import com.movierentalservice.dto.MovieDto;
import com.movierentalservice.dto.RentalDto;
import com.movierentalservice.service.AdminService;
import com.movierentalservice.service.ImageService;
import com.movierentalservice.service.RentalService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final RentalService rentalService;
    private final ImageService imageService;

    // Image handling
    @PostMapping("/images")
    public ResponseEntity<ImageUploadResponseDto> uploadMovieImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageId = imageService.uploadImage(file);
            return ResponseEntity.ok(new ImageUploadResponseDto(imageId));
        } catch (IOException e) {
            log.error("Error uploading image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Movie Management
    @PostMapping("/movies")
    public ResponseEntity<MovieDto> addMovie(@RequestBody MovieDto movieDto) {
        MovieDto addedMovie = adminService.addMovie(movieDto);
        return new ResponseEntity<>(addedMovie, HttpStatus.CREATED);
    }

    @PutMapping("/movies/{movieId}")
    public ResponseEntity<MovieDto> updateMovie(
            @PathVariable Long movieId,
            @RequestBody MovieDto movieDto) {
        MovieDto updatedMovie = adminService.updateMovie(movieId, movieDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/movies/{movieId}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long movieId) {
        adminService.deleteMovie(movieId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/movies/{movieId}/rentals")
    public ResponseEntity<List<RentalDto>> getMovieRentals(@PathVariable Long movieId) {
        List<RentalDto> rentals = rentalService.getRentalsByMovieId(movieId);
        return ResponseEntity.ok(rentals);
    }

    // Rental Management
    @GetMapping("/rentals")
    public ResponseEntity<List<RentalDto>> getAllRentals(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String status) {
        List<RentalDto> rentals = adminService.getAllRentals(email, status);
        return ResponseEntity.ok(rentals);
    }

    @PatchMapping("/rentals/{rentalId}/return")
    public ResponseEntity<RentalDto> returnRental(@PathVariable Long rentalId) {
        RentalDto returnedRental = adminService.returnRental(rentalId);
        return ResponseEntity.ok(returnedRental);
    }

    @PatchMapping("/rentals/{rentalId}/take")
    public ResponseEntity<RentalDto> markRentalAsTaken(@PathVariable Long rentalId) {
        RentalDto takenRental = adminService.markRentalAsTaken(rentalId);
        return ResponseEntity.ok(takenRental);
    }
} 