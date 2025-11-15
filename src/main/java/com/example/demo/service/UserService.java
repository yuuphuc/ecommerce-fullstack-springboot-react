package com.example.demo.service;

import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    UserDto getProfile(UserDetails userDetails);
    UserDto updateProfile(UserDetails userDetails, UpdateProfileRequest request);
}
