package com.movierentalservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jms.annotation.EnableJms;

@SpringBootApplication
@EnableJms
public class MovieRentalServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieRentalServiceApplication.class, args);
    }
} 