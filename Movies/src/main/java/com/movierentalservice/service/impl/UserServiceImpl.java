package com.movierentalservice.service.impl;

import com.movierentalservice.dto.LoginRequest;
import com.movierentalservice.dto.RegistrationRequest;
import com.movierentalservice.dto.UserDto;
import com.movierentalservice.entity.User;
import com.movierentalservice.exception.ResourceNotFoundException;
import com.movierentalservice.jms.EmailSender;
import com.movierentalservice.repository.UserRepository;
import com.movierentalservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final EmailSender emailSender;
    
    @Override
    public UserDto registerUser(RegistrationRequest registrationRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Create new user
        User user = User.builder()
                .email(registrationRequest.getEmail())
                .password(registrationRequest.getPassword()) // In a real app, you would hash the password
                .fullName(registrationRequest.getFullName())
                .phoneNumber(registrationRequest.getPhoneNumber())
                .address(registrationRequest.getAddress())
                .role(User.Role.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        User savedUser = userRepository.save(user);
        
        // Send registration email
        emailSender.sendRegistrationEmail(savedUser.getEmail(), savedUser.getFullName());
        
        return mapToDto(savedUser);
    }
    
    @Override
    public UserDto authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // In a real app, you would verify the hashed password
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return mapToDto(user);
    }
    
    @Override
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return mapToDto(user);
    }
    
    @Override
    public UserDto updateUser(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        // Update user details
        user.setFullName(userDto.getFullName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setAddress(userDto.getAddress());
        // In a real app, you would hash the password if it's being updated
        // user.setPassword(hashedPassword);
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        
        return mapToDto(updatedUser);
    }
    
    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .isAdmin(user.getRole() == User.Role.ADMIN)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
} 