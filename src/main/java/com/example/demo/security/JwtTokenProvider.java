package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;
    private final Key key;

    public JwtTokenProvider(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Tạo JWT Token với thời gian hết hạn
     * 
     * @param authentication - Thông tin xác thực
     * @return JWT token string
     */
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        // Lấy roles từ authentication
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        // Thiết lập thời gian
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getExpiration());

        System.out.println("Token created at: " + now);
        System.out.println("Token expires at: " + expiryDate);
        System.out.println("Valid for: " + (jwtProperties.getExpiration() / 1000 / 60) + " minutes");

        return Jwts.builder()
                .setSubject(username) // Username
                .claim("authorities", roles) // Roles
                .setIssuedAt(now) // Thời điểm tạo token
                .setExpiration(expiryDate) // Thời điểm hết hạn
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Lấy username từ token
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * Kiểm tra token còn hợp lệ không
     * 
     * @return true nếu token hợp lệ và chưa hết hạn
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Kiểm tra thời gian hết hạn
            Date expiration = claims.getExpiration();
            Date now = new Date();

            if (expiration.before(now)) {
                System.out.println("❌ Token đã hết hạn!");
                System.out.println("   Expired at: " + expiration);
                System.out.println("   Current time: " + now);
                return false;
            }

            System.out.println("✅ Token còn hợp lệ");
            long remainingTime = (expiration.getTime() - now.getTime()) / 1000 / 60;
            System.out.println("   Còn lại: " + remainingTime + " phút");

            return true;

        } catch (ExpiredJwtException e) {
            System.out.println("❌ Token hết hạn: " + e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            System.out.println("❌ Token không hợp lệ: " + e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            System.out.println("❌ Token không được hỗ trợ: " + e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Token rỗng: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.out.println("❌ Lỗi xác thực token: " + e.getMessage());
            return false;
        }
    }

    // Lấy thời gian còn lại của token (milliseconds)
    public long getTokenRemainingTime(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Date expiration = claims.getExpiration();
            Date now = new Date();

            return expiration.getTime() - now.getTime();
        } catch (Exception e) {
            return 0;
        }
    }

    // Kiểm tra token sắp hết hạn (còn < 5 phút)
    public boolean isTokenExpiringSoon(String token) {
        long remainingTime = getTokenRemainingTime(token);
        long fiveMinutes = 5 * 60 * 1000; // 5 phút

        return remainingTime > 0 && remainingTime < fiveMinutes;
    }
}