package com.emailservice.jms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.emailservice.service.EmailService;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j  // This will be ignored since we're defining our own logger
public class EmailConsumer {
    
    // Explicit logger definition instead of relying on Lombok
    private static final Logger log = LoggerFactory.getLogger(EmailConsumer.class);
    
    private final EmailService emailService;
    private final ObjectMapper objectMapper;
    
    // Explicit constructor
    public EmailConsumer(EmailService emailService, ObjectMapper objectMapper) {
        this.emailService = emailService;
        this.objectMapper = objectMapper;
    }
    
    @JmsListener(destination = "${movie.rental.jms.email.queue}")
    public void receiveMessage(String jsonMessage) {
        log.info("Received JSON message: {}", jsonMessage);
        
        try {
            // Convert JSON to EmailMessage
            EmailMessage emailMessage = objectMapper.readValue(jsonMessage, EmailMessage.class);
            log.info("Converted to email message: {}", emailMessage);
            
            // Process the email message
            emailService.sendEmail(emailMessage);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse JSON message: {}", e.getMessage());
        }
    }
} 