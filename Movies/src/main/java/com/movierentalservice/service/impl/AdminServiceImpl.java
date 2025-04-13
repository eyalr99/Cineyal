package com.movierentalservice.service.impl;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movierentalservice.dto.MovieDto;
import com.movierentalservice.dto.RentalDto;
import com.movierentalservice.entity.Actor;
import com.movierentalservice.entity.Category;
import com.movierentalservice.entity.Movie;
import com.movierentalservice.entity.Rental;
import com.movierentalservice.exception.ResourceNotFoundException;
import com.movierentalservice.repository.ActorRepository;
import com.movierentalservice.repository.CategoryRepository;
import com.movierentalservice.repository.MovieRepository;
import com.movierentalservice.repository.RentalRepository;
import com.movierentalservice.repository.UserRepository;
import com.movierentalservice.service.AdminService;
import com.movierentalservice.service.ImageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    
    private final MovieRepository movieRepository;
    private final ActorRepository actorRepository;
    private final CategoryRepository categoryRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;
    
    @Override
    @Transactional
    public MovieDto addMovie(MovieDto movieDto) {
        // Create movie entity
        Movie movie = Movie.builder()
                .title(movieDto.getTitle())
                .description(movieDto.getDescription())
                .releaseYear(movieDto.getReleaseYear())
                .director(movieDto.getDirector())
                .duration(movieDto.getDuration())
                .stockQuantity(movieDto.getStockQuantity())
                .imageId(movieDto.getImageId())
                .actors(new HashSet<>())
                .categories(new HashSet<>())
                .build();
        
        // Add actors
        if (movieDto.getActors() != null) {
            Set<Actor> actors = new HashSet<>();
            for (String actorName : movieDto.getActors()) {
                Actor actor = actorRepository.findByNameContainingIgnoreCase(actorName)
                        .stream().findFirst().orElseGet(() -> {
                            Actor newActor = new Actor();
                            newActor.setName(actorName);
                            return actorRepository.save(newActor);
                        });
                actors.add(actor);
            }
            movie.setActors(actors);
        }
        
        // Add categories
        if (movieDto.getCategories() != null) {
            Set<Category> categories = new HashSet<>();
            for (String categoryName : movieDto.getCategories()) {
                Category category = categoryRepository.findByNameContainingIgnoreCase(categoryName)
                        .stream().findFirst().orElseGet(() -> {
                            Category newCategory = new Category();
                            newCategory.setName(categoryName);
                            return categoryRepository.save(newCategory);
                        });
                categories.add(category);
            }
            movie.setCategories(categories);
        }
        
        Movie savedMovie = movieRepository.save(movie);
        
        return mapToDto(savedMovie);
    }
    
    @Override
    @Transactional
    public MovieDto updateMovie(Long movieId, MovieDto movieDto) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        
        // Store old imageId in case we need to delete it
        String oldImageId = movie.getImageId();
        
        // Update movie details
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setReleaseYear(movieDto.getReleaseYear());
        movie.setDirector(movieDto.getDirector());
        movie.setDuration(movieDto.getDuration());
        movie.setStockQuantity(movieDto.getStockQuantity());
        movie.setImageId(movieDto.getImageId());
        
        // Update actors
        if (movieDto.getActors() != null) {
            Set<Actor> actors = new HashSet<>();
            for (String actorName : movieDto.getActors()) {
                Actor actor = actorRepository.findByNameContainingIgnoreCase(actorName)
                        .stream().findFirst().orElseGet(() -> {
                            Actor newActor = new Actor();
                            newActor.setName(actorName);
                            return actorRepository.save(newActor);
                        });
                actors.add(actor);
            }
            movie.setActors(actors);
        }
        
        // Update categories
        if (movieDto.getCategories() != null) {
            Set<Category> categories = new HashSet<>();
            for (String categoryName : movieDto.getCategories()) {
                Category category = categoryRepository.findByNameContainingIgnoreCase(categoryName)
                        .stream().findFirst().orElseGet(() -> {
                            Category newCategory = new Category();
                            newCategory.setName(categoryName);
                            return categoryRepository.save(newCategory);
                        });
                categories.add(category);
            }
            movie.setCategories(categories);
        }
        
        Movie updatedMovie = movieRepository.save(movie);
        
        // If image was changed, delete the old one
        if (oldImageId != null && !oldImageId.equals(movieDto.getImageId())) {
            try {
                imageService.deleteImage(oldImageId);
            } catch (Exception e) {
                // Log error but continue
                // Don't fail the update if image deletion fails
            }
        }
        
        return mapToDto(updatedMovie);
    }
    
    @Override
    @Transactional
    public void deleteMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        
        // Check if there are active rentals for this movie
        List<Rental> activeRentals = rentalRepository.findByMovieIdAndStatus(
                movieId, Rental.RentalStatus.TAKEN);
        
        if (!activeRentals.isEmpty()) {
            throw new RuntimeException("Cannot delete movie with active rentals");
        }
        
        // Delete associated image if it exists
        if (movie.getImageId() != null) {
            try {
                imageService.deleteImage(movie.getImageId());
            } catch (Exception e) {
                // Log error but continue
                // Don't fail the deletion if image deletion fails
            }
        }
        
        movieRepository.delete(movie);
    }
    
    @Override
    public List<RentalDto> getAllRentals(String email, String status) {
        List<Rental> rentals;
        
        if (email != null && status != null) {
            // Find user by email
            Long userId = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", email))
                    .getId();
            
            Rental.RentalStatus rentalStatus = Rental.RentalStatus.valueOf(status.toUpperCase());
            rentals = rentalRepository.findByUserIdAndStatusOrderByRentalDateDesc(userId, rentalStatus);
        } else if (email != null) {
            // Find user by email
            Long userId = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", email))
                    .getId();
            
            rentals = rentalRepository.findByUserIdOrderByRentalDateDesc(userId);
        } else if (status != null) {
            Rental.RentalStatus rentalStatus = Rental.RentalStatus.valueOf(status.toUpperCase());
            rentals = rentalRepository.findByStatusOrderByRentalDateDesc(rentalStatus);
        } else {
            rentals = rentalRepository.findAllByOrderByRentalDateDesc();
        }
        
        return rentals.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public RentalDto returnRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental", "id", rentalId));
        
        if (rental.getStatus() != Rental.RentalStatus.TAKEN) {
            throw new RuntimeException("Rental is not active");
        }
        
        // Update rental status
        rental.setStatus(Rental.RentalStatus.RETURNED);
        rental.setReturnDate(LocalDateTime.now());
        
        // Increase movie stock
        Movie movie = rental.getMovie();
        movie.setStockQuantity(movie.getStockQuantity() + 1);
        movieRepository.save(movie);
        
        Rental updatedRental = rentalRepository.save(rental);
        
        return mapToDto(updatedRental);
    }
    
    @Override
    @Transactional
    public RentalDto markRentalAsTaken(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental", "id", rentalId));
        
        if (rental.getStatus() != Rental.RentalStatus.ORDERED) {
            throw new RuntimeException("Rental is not in ORDERED status");
        }
        
        // Update rental status
        rental.setStatus(Rental.RentalStatus.TAKEN);
        
        Rental updatedRental = rentalRepository.save(rental);
        
        return mapToDto(updatedRental);
    }
    
    private MovieDto mapToDto(Movie movie) {
        return MovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .releaseYear(movie.getReleaseYear())
                .director(movie.getDirector())
                .duration(movie.getDuration())
                .imageId(movie.getImageId())
                .actors(movie.getActors().stream()
                        .map(Actor::getName)
                        .collect(Collectors.toList()))
                .categories(movie.getCategories().stream()
                        .map(Category::getName)
                        .collect(Collectors.toList()))
                .averageRating(movie.getAverageRating())
                .stockQuantity(movie.getStockQuantity())
                .available(movie.isAvailable())
                .build();
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