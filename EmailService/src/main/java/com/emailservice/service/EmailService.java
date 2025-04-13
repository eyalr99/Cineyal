package com.emailservice.service;

import com.emailservice.jms.EmailMessage;

public interface EmailService {
    
    /**
     * Send email based on the email message
     * 
     * @param emailMessage the email message to send
     */
    void sendEmail(EmailMessage emailMessage);
    
    /**
     * Send registration email
     * 
     * @param to the recipient email address
     * @param userName the user name
     */
    void sendRegistrationEmail(String to, String userName);
    
    /**
     * Send rental confirmation email
     * 
     * @param to the recipient email address
     * @param userName the user name
     * @param movieTitle the movie title
     * @param rentalCode the rental code
     */
    void sendRentalConfirmationEmail(String to, String userName, String movieTitle, String rentalCode);
} 