package com.example.demo;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
@RequiredArgsConstructor
public class DemoResTfullApiApplication implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(DemoResTfullApiApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Tạo admin mặc định nếu chưa tồn tại
		if (userRepository.findByUsername("admin").isEmpty()) {
			User admin = User.builder()
					.username("admin")
					.password(passwordEncoder.encode("admin123"))
					.role("ADMIN")
					.build();
			userRepository.save(admin);
			System.out.println("✅ Default admin user created: username=admin, password=admin123");
		}
	}
}
