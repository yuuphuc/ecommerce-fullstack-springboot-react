package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Username không được để trống")
    private String username;

    @Column(nullable = false)
    @NotBlank(message = "Password không được để trống")
    private String password;

    @Column(nullable = false)
    private String role; // ROLE_USER hoặc ROLE_ADMIN
    
    @Column(unique = true)
    @Email(message = "Email không hợp lệ")
    private String email;
    
    private String address;
    
    @Column(unique = true, nullable = true)
    @Pattern(
        regexp = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$",
        message = "Số điện thoại không hợp lệ (VD: 0912345678)"
    )
    private String phoneNumber;
}