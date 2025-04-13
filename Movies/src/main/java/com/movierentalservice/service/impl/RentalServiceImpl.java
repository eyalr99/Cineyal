package com.movierentalservice.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movierentalservice.dto.RentalDto;
import com.movierentalservice.entity.Movie;
import com.movierentalservice.entity.Rental;
import com.movierentalservice.entity.User;
import com.movierentalservice.exception.ResourceNotFoundException;
import com.movierentalservice.jms.EmailSender;
import com.movierentalservice.repository.MovieRepository;
import com.movierentalservice.repository.RentalRepository;
import com.movierentalservice.repository.UserRepository;
import com.movierentalservice.service.RentalService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RentalServiceImpl implements RentalService {
    
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final EmailSender emailSender;
    
    @Value("${movie.rental.code.length:8}")
    private int rentalCodeLength;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    
    @Override
    @Transactional
    public RentalDto createRental(RentalDto rentalDto) {
        User user = userRepository.findById(rentalDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", rentalDto.getUserId()));
        
        Movie movie = movieRepository.findById(rentalDto.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", rentalDto.getMovieId()));
        
        // Check if movie is available
        if (movie.getStockQuantity() <= 0) {
            throw new RuntimeException("Movie is not available for rental");
        }
        
        // Generate unique rental code
        String rentalCode = generateRentalCode();
        
        // Create rental
        Rental rental = Rental.builder()
                .user(user)
                .movie(movie)
                .rentalCode(rentalCode)
                .rentalDate(rentalDto.getRentalDate() != null ? rentalDto.getRentalDate() : LocalDateTime.now())
                .returnDate(rentalDto.getReturnDate() != null ? rentalDto.getReturnDate() : LocalDateTime.now().plusDays(7))
                .status(Rental.RentalStatus.ORDERED)
                .build();
        
        // Decrease movie stock
        movie.setStockQuantity(movie.getStockQuantity() - 1);
        movieRepository.save(movie);
        
        Rental savedRental = rentalRepository.save(rental);
        
        // Send rental confirmation email
        emailSender.sendRentalConfirmationEmail(
                user.getEmail(),
                user.getFullName(),
                movie.getTitle(),
                rentalCode
        );
        
        return mapToDto(savedRental);
    }
    
    @Override
    public RentalDto getRentalById(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental", "id", rentalId));
        
        return mapToDto(rental);
    }
    
    @Override
    public RentalDto getRentalByCode(String rentalCode) {
        Rental rental = rentalRepository.findByRentalCode(rentalCode)
                .orElseThrow(() -> new ResourceNotFoundException("Rental", "code", rentalCode));
        
        return mapToDto(rental);
    }
    
    @Override
    public List<RentalDto> getRentalHistoryByUserId(Long userId) {
        // Check if user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        List<Rental> rentals = rentalRepository.findByUserIdOrderByRentalDateDesc(userId);
        
        return rentals.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RentalDto> getRentalsByMovieId(Long movieId) {
        // Check if movie exists
        movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        
        List<Rental> rentals = rentalRepository.findByMovieIdOrderByRentalDateDesc(movieId);
        
        return rentals.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RentalDto> getTakenRentals() {
        List<Rental> takenRentals = rentalRepository.findByStatusOrderByRentalDateDesc(Rental.RentalStatus.TAKEN);
        
        return takenRentals.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RentalDto> getOrderedRentals() {
        List<Rental> orderedRentals = rentalRepository.findByStatusOrderByRentalDateDesc(Rental.RentalStatus.ORDERED);
        
        return orderedRentals.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public RentalDto cancelRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental", "id", rentalId));
        
        // Only ordered or taken rentals can be cancelled
        if (rental.getStatus() != Rental.RentalStatus.ORDERED && 
            rental.getStatus() != Rental.RentalStatus.TAKEN) {
            throw new RuntimeException("Rental cannot be cancelled");
        }
        
        // If the movie was taken, increase movie stock
        boolean wasTaken = rental.getStatus() == Rental.RentalStatus.TAKEN;
        
        // Update rental status and set returnDate to null
        rental.setStatus(Rental.RentalStatus.CANCELLED);
        rental.setReturnDate(null);
        
        // Return movie to inventory if it was taken
        if (wasTaken) {
            Movie movie = rental.getMovie();
            movie.setStockQuantity(movie.getStockQuantity() + 1);
            movieRepository.save(movie);
        }
        
        Rental updatedRental = rentalRepository.save(rental);
        
        return mapToDto(updatedRental);
    }
    
    private String generateRentalCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < rentalCodeLength; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        String rentalCode = sb.toString();
        
        // Check if code already exists
        if (rentalRepository.findByRentalCode(rentalCode).isPresent()) {
            return generateRentalCode(); // Recursively generate a new code
        }
        
        return rentalCode;
    }
    
    private RentalDto mapToDto(Rental rental) {
        return RentalDto.builder()
                .id(rental.getId())
                .userId(rental.getUser().getId())
                .userFullName(rental.getUser().getFullName())
                .movieId(rental.getMovie().getId())
                .movieTitle(rental.getMovie().getTitle())
                .rentalCode(rental.getRentalCode())
                .rentalDate(rental.getRentalDate())
                .returnDate(rental.getReturnDate())
                .status(rental.getStatus().name())
                .build();
    }
} 