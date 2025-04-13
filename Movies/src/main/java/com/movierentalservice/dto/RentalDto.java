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
public class RentalDto {
    private Long id;
    private Long userId;
    private String userFullName;
    private Long movieId;
    private String movieTitle;
    private String rentalCode;
    private LocalDateTime rentalDate;
    private LocalDateTime returnDate;
    private String status; // ORDERED, TAKEN, RETURNED, CANCELLED
} 