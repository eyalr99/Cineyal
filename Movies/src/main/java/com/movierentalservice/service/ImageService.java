package com.movierentalservice.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    
    /**
     * Upload an image and return a unique ID for it
     * 
     * @param file the image file to upload
     * @return the unique ID assigned to the image
     * @throws IOException if the file cannot be read or stored
     */
    String uploadImage(MultipartFile file) throws IOException;
    
    /**
     * Get an image by its unique ID
     * 
     * @param imageId the unique ID of the image
     * @return byte array containing the image data
     * @throws IOException if the image cannot be found or read
     */
    byte[] getImage(String imageId) throws IOException;
    
    /**
     * Delete an image by its unique ID
     * 
     * @param imageId the unique ID of the image
     * @return true if the image was deleted, false otherwise
     */
    boolean deleteImage(String imageId);
} 