package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @Pattern(
        regexp = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$",
        message = "Số điện thoại không hợp lệ (VD: 0912345678)"
    )
    private String phoneNumber;
    
    @Size(max = 500, message = "Địa chỉ không được quá 500 ký tự")
    private String address;
}