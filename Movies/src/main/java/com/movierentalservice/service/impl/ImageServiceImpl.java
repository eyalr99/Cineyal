package com.movierentalservice.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.movierentalservice.service.ImageService;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ImageServiceImpl implements ImageService {
    
    @Value("${app.image.storage.dir:images}")
    private String imageStorageDir;
    
    private Path storageLocation;
    
    @PostConstruct
    public void init() {
        // Create directory if it doesn't exist
        this.storageLocation = Paths.get(imageStorageDir).toAbsolutePath().normalize();
        log.info("Image storage directory: {}", this.storageLocation);
        try {
            Files.createDirectories(this.storageLocation);
            log.info("Image storage directory created: {}", this.storageLocation);
        } catch (IOException ex) {
            log.error("Could not create image storage directory: {}", ex.getMessage());
        }
    }
    
    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file");
        }
        
        // Generate unique ID for the image
        String imageId = generateUniqueId();
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String filename = imageId + fileExtension;
        
        // Save file to storage location
        Path targetLocation = this.storageLocation.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation);
        
        log.info("Uploaded image with ID: {} at location: {}", imageId, targetLocation);
        return imageId;
    }
    
    @Override
    public byte[] getImage(String imageId) throws IOException {
        // Find the file with the given ID (regardless of extension)
        File directory = storageLocation.toFile();
        File[] matchingFiles = directory.listFiles((dir, name) -> name.startsWith(imageId + "."));
        
        if (matchingFiles == null || matchingFiles.length == 0) {
            throw new IOException("Image not found with ID: " + imageId);
        }
        
        // Return the first matching file
        return Files.readAllBytes(matchingFiles[0].toPath());
    }
    
    @Override
    public boolean deleteImage(String imageId) {
        // Find the file with the given ID (regardless of extension)
        File directory = storageLocation.toFile();
        File[] matchingFiles = directory.listFiles((dir, name) -> name.startsWith(imageId + "."));
        
        if (matchingFiles == null || matchingFiles.length == 0) {
            return false;
        }
        
        // Delete all matching files
        boolean allDeleted = true;
        for (File file : matchingFiles) {
            boolean deleted = file.delete();
            if (!deleted) {
                allDeleted = false;
                log.error("Failed to delete file: {}", file.getAbsolutePath());
            }
        }
        
        return allDeleted;
    }
    
    /**
     * Generate a unique ID for the image
     * 
     * @return a string representing a unique ID
     */
    private String generateUniqueId() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Extract file extension from filename
     * 
     * @param filename the original filename
     * @return the file extension including the dot (e.g., ".jpg")
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return ".jpg"; // Default extension
        }
        return filename.substring(filename.lastIndexOf("."));
    }
} 