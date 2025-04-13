package com.movierentalservice.repository;

import com.movierentalservice.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    
    List<Rental> findByUserId(Long userId);
    
    List<Rental> findByMovieId(Long movieId);
    
    Optional<Rental> findByRentalCode(String rentalCode);
    
    List<Rental> findByStatus(Rental.RentalStatus status);
    
    List<Rental> findByUserIdAndStatus(Long userId, Rental.RentalStatus status);
    
    List<Rental> findByMovieIdAndStatus(Long movieId, Rental.RentalStatus status);
    
    // New methods with ordered results (newest rentals first)
    List<Rental> findAllByOrderByRentalDateDesc();
    
    List<Rental> findByUserIdOrderByRentalDateDesc(Long userId);
    
    List<Rental> findByMovieIdOrderByRentalDateDesc(Long movieId);
    
    List<Rental> findByStatusOrderByRentalDateDesc(Rental.RentalStatus status);
    
    List<Rental> findByUserIdAndStatusOrderByRentalDateDesc(Long userId, Rental.RentalStatus status);
    
    List<Rental> findByMovieIdAndStatusOrderByRentalDateDesc(Long movieId, Rental.RentalStatus status);
} 