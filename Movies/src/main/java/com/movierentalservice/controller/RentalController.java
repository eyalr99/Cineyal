package com.movierentalservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movierentalservice.dto.RentalDto;
import com.movierentalservice.service.RentalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<RentalDto> createRental(@RequestBody RentalDto rentalDto) {
        RentalDto createdRental = rentalService.createRental(rentalDto);
        return new ResponseEntity<>(createdRental, HttpStatus.CREATED);
    }

    @GetMapping("/{rentalId}")
    public ResponseEntity<RentalDto> getRentalDetails(@PathVariable Long rentalId) {
        RentalDto rental = rentalService.getRentalById(rentalId);
        return ResponseEntity.ok(rental);
    }

    @GetMapping("/code/{rentalCode}")
    public ResponseEntity<RentalDto> getRentalByCode(@PathVariable String rentalCode) {
        RentalDto rental = rentalService.getRentalByCode(rentalCode);
        return ResponseEntity.ok(rental);
    }

    @PatchMapping("/{rentalId}/cancel")
    public ResponseEntity<RentalDto> cancelRental(@PathVariable Long rentalId) {
        RentalDto cancelledRental = rentalService.cancelRental(rentalId);
        return ResponseEntity.ok(cancelledRental);
    }
} 