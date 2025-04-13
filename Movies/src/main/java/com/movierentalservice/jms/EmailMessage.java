package com.movierentalservice.jms;

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
    
    public enum EmailType {
        REGISTRATION,
        RENTAL_CONFIRMATION
    }
} 