package com.emailservice.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.emailservice.jms.EmailMessage;
import com.emailservice.service.EmailService;
import com.sendgrid.SendGrid;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.Method;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import java.io.IOException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j  // This will be ignored since we're defining our own logger
public class EmailServiceImpl implements EmailService {
    
    // Explicit logger definition instead of relying on Lombok
    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Value("${sendgrid.api.key}")
    private String apiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Override
    public void sendEmail(EmailMessage emailMessage) {
        log.info("Processing email message: {}", emailMessage);

        if (emailMessage.getType() == EmailMessage.EmailType.REGISTRATION) {
            sendRegistrationEmail(emailMessage.getTo(), emailMessage.getUserName());
        } else if (emailMessage.getType() == EmailMessage.EmailType.RENTAL_CONFIRMATION) {
            sendRentalConfirmationEmail(
                emailMessage.getTo(),
                emailMessage.getUserName(),
                emailMessage.getMovieTitle(),
                emailMessage.getRentalCode()
            );
        } else {
            log.warn("Unknown email type: {}", emailMessage.getType());
        }
    }
    
    @Override
    public void sendRegistrationEmail(String to, String userName) {
        log.info("Sending registration email to: {}, userName: {}", to, userName);
        String subject = "Welcome to Movie Rental Service";
        String body = String.format("Thank you for registering with our Movie Rental Service, %s.", userName);
        
        try {
            sendMailWithSendGrid(to, subject, body);
        } catch (IOException e) {
            log.error("Failed to send registration email: {}", e.getMessage(), e);
        }
    }
    
    @Override
    public void sendRentalConfirmationEmail(String to, String userName, String movieTitle, String rentalCode) {
        log.info("Sending rental confirmation email to: {}, userName: {}", to, userName);
        String subject = "Movie Rental Confirmation";
        String body = String.format("Dear %s, your rental of '%s' has been confirmed. Your rental code is: %s", 
                userName, movieTitle, rentalCode);
        
        try {
            sendMailWithSendGrid(to, subject, body);
        } catch (IOException e) {
            log.error("Failed to send rental confirmation email: {}", e.getMessage(), e);
        }
    }
    
    private Response sendMailWithSendGrid(String to, String subject, String text) throws IOException {
        // Use env variable if available, otherwise use the injected value
        String sendgridApiKey = System.getenv("SENDGRID_API_KEY");
        if (sendgridApiKey == null || sendgridApiKey.isEmpty()) {
            sendgridApiKey = this.apiKey;
        }
        
        String from = System.getenv("SENDGRID_FROM_EMAIL");
        if (from == null || from.isEmpty()) {
            from = this.fromEmail;
        }
        
        log.info("Sending email via SendGrid to: {}, subject: {}", to, subject);

        if (!to.toLowerCase().equals("eyalr99@gmail.com") && !to.toLowerCase().equals("eyal@trullion.com")) {
            log.info("Skipping email to: {}, as it's not in the allowed list", to);
            return null;
        }
        
        Email fromEmail = new Email(from);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", text);
        Mail mail = new Mail(fromEmail, subject, toEmail, content);

        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();
        
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        
        Response response = sg.api(request);
        log.info("Email request sent. Status code: {}", response.getStatusCode());
        
        return response;
    }
}