package com.example.demo.service.impl;

import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // ------------------------------- GET PROFILE ------------------------------- //
    @Override
    public UserDto getProfile(UserDetails userDetails) {
        User user = userRepository
                .findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.toDto(user);
    }

    // ------------------------------- UPDATE PROFILE --------------------------- //
    @Override
    public UserDto updateProfile(UserDetails userDetails, UpdateProfileRequest request) {

        User user = userRepository
                .findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields (nullable allowed)
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null) user.setAddress(request.getAddress());

        userRepository.save(user);

        return UserMapper.toDto(user);
    }
}
