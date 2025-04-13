package com.movierentalservice.repository;

import com.movierentalservice.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    List<Rating> findByMovieId(Long movieId);
    
    List<Rating> findByUserId(Long userId);
    
    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.movie.id = :movieId")
    Double getAverageRatingForMovie(@Param("movieId") Long movieId);
} 