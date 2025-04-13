package com.movierentalservice.repository;

import com.movierentalservice.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    
    List<Movie> findByTitleContainingIgnoreCase(String title);
    
    Optional<Movie> findByTitleIgnoreCase(String title);

    Optional<Movie> findByTitle(String title);
    
    List<Movie> findByDescriptionContainingIgnoreCase(String description);
    
    List<Movie> findByDirectorContainingIgnoreCase(String director);
    
    List<Movie> findByReleaseYear(Integer releaseYear);
    
    @Query("SELECT m FROM Movie m JOIN m.categories c WHERE c.name = :categoryName")
    List<Movie> findByCategory(@Param("categoryName") String categoryName);
    
    @Query("SELECT m FROM Movie m JOIN m.actors a WHERE a.name LIKE %:actorName%")
    List<Movie> findByActor(@Param("actorName") String actorName);
    
    @Query("SELECT m FROM Movie m WHERE " +
           "LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.director) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Movie> searchMovies(@Param("search") String search);
    
    @Query("SELECT m FROM Movie m WHERE m.stockQuantity > 0")
    List<Movie> findAvailableMovies();
} 