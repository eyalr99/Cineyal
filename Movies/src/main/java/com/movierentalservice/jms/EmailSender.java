package com.movierentalservice.jms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.JmsException;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailSender {
    
    private final JmsTemplate jmsTemplate;
    
    @Value("${movie.rental.jms.email.queue}")
    private String emailQueue;
    
    public void sendRegistrationEmail(String to, String userName) {
        EmailMessage emailMessage = EmailMessage.builder()
                .to(to)
                .subject("Welcome to Movie Rental Service")
                .type(EmailMessage.EmailType.REGISTRATION)
                .userName(userName)
                .body("Thank you for registering with our Movie Rental Service.")
                .build();
        
        sendEmail(emailMessage);
    }
    
    public void sendRentalConfirmationEmail(String to, String userName, String movieTitle, String rentalCode) {
        EmailMessage emailMessage = EmailMessage.builder()
                .to(to)
                .subject("Movie Rental Confirmation")
                .type(EmailMessage.EmailType.RENTAL_CONFIRMATION)
                .userName(userName)
                .movieTitle(movieTitle)
                .rentalCode(rentalCode)
                .body("Your movie rental has been confirmed.")
                .build();
        
        sendEmail(emailMessage);
    }
    
    private void sendEmail(EmailMessage emailMessage) {
        try {
            // Convert EmailMessage to JSON before sending
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonMessage = objectMapper.writeValueAsString(emailMessage);
            
            jmsTemplate.convertAndSend(emailQueue, jsonMessage);
            log.info("Email message sent to queue as JSON: {}", emailQueue);
        } catch (JmsException e) {
            log.error("Failed to send email message to queue: {}", e.getMessage());
        } catch (JsonProcessingException e) {
            log.error("Failed to convert email message to JSON: {}", e.getMessage());
        }
    }
} 