package com.movierentalservice.service;

import java.util.List;

import com.movierentalservice.dto.RentalDto;

public interface RentalService {
    
    RentalDto createRental(RentalDto rentalDto);
    
    RentalDto getRentalById(Long rentalId);
    
    RentalDto getRentalByCode(String rentalCode);
    
    List<RentalDto> getRentalHistoryByUserId(Long userId);
    
    List<RentalDto> getRentalsByMovieId(Long movieId);
    
    List<RentalDto> getTakenRentals();
    
    List<RentalDto> getOrderedRentals();
    
    RentalDto cancelRental(Long rentalId);
} 