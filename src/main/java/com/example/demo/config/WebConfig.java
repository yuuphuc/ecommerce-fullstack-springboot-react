package com.example.demo.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:3000", // Để code dưới máy local
                        "https://ecommerce-fullstack-springboot-react-k5o7.vercel.app" //để LINK VERCEL THẬT CỦA BẠN
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép tất cả các phương thức HTTP
                .allowedHeaders("*")
                .exposedHeaders("Authorization") // Quan trọng: cho phép frontend đọc header Authorization
                .allowCredentials(true);
    }
}
