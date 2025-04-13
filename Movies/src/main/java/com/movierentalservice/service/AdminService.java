package com.movierentalservice.service;

import java.util.List;

import com.movierentalservice.dto.MovieDto;
import com.movierentalservice.dto.RentalDto;

public interface AdminService {
    
    MovieDto addMovie(MovieDto movieDto);
    
    MovieDto updateMovie(Long movieId, MovieDto movieDto);
    
    void deleteMovie(Long movieId);
    
    List<RentalDto> getAllRentals(String email, String status);
    
    RentalDto returnRental(Long rentalId);
    
    RentalDto markRentalAsTaken(Long rentalId);
} 