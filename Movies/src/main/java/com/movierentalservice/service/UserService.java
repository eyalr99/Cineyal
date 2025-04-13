package com.movierentalservice.service;

import com.movierentalservice.dto.LoginRequest;
import com.movierentalservice.dto.RegistrationRequest;
import com.movierentalservice.dto.UserDto;

public interface UserService {
    
    UserDto registerUser(RegistrationRequest registrationRequest);
    
    UserDto authenticateUser(LoginRequest loginRequest);
    
    UserDto getUserById(Long userId);
    
    UserDto updateUser(Long userId, UserDto userDto);
} 