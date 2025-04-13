package com.movierentalservice.controller;

import com.movierentalservice.dto.RentalDto;
import com.movierentalservice.dto.UserDto;
import com.movierentalservice.service.RentalService;
import com.movierentalservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RentalService rentalService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserDetails(@PathVariable Long userId) {
        UserDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUserDetails(
            @PathVariable Long userId,
            @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/{userId}/rentals")
    public ResponseEntity<List<RentalDto>> getUserRentalHistory(@PathVariable Long userId) {
        List<RentalDto> rentalHistory = rentalService.getRentalHistoryByUserId(userId);
        return ResponseEntity.ok(rentalHistory);
    }
} 