package com.emailservice.jms;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailMessage implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private String to;
    private String subject;
    private String body;
    
    // Email type to determine template
    private EmailType type;
    
    // Additional data for templates
    private String userName;
    private String movieTitle;
    private String rentalCode;
    
    // Explicit getters since Lombok may not be recognized by the linter
    public String getTo() {
        return to;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public String getBody() {
        return body;
    }
    
    public EmailType getType() {
        return type;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public String getMovieTitle() {
        return movieTitle;
    }
    
    public String getRentalCode() {
        return rentalCode;
    }
    
    public enum EmailType {
        REGISTRATION,
        RENTAL_CONFIRMATION
    }
} 