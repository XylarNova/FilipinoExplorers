package com.filipinoexplorers.capstone.service;

import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(User user) {
        String roleName = user.getRole().name(); // e.g., TEACHER or STUDENT
        String fullRole = "ROLE_" + roleName;

        var builder = Jwts.builder()
            .setSubject(user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
            .claim("role", fullRole)
            .claim("roles", List.of(fullRole)) // 👈 FIX: Required for JwtAuthFilter
            .claim("authorities", List.of(fullRole)) // 👈 Often used by Spring Security
            .claim("userId", user.getId());

        // Optional: Add teacherId or studentId if applicable
        if (roleName.equals("TEACHER")) {
            builder.claim("teacherId", ((com.filipinoexplorers.capstone.entity.Teacher) user).getTeacherId());
        } else if (roleName.equals("STUDENT")) {
            builder.claim("studentId", ((com.filipinoexplorers.capstone.entity.Student) user).getStudentId());
        }

        return builder.signWith(secretKey).compact();
    }



    public String extractUsername(String token) {
        JwtParser parser = Jwts.parserBuilder().setSigningKey(secretKey).build();
        Claims claims = parser.parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            JwtParser parser = Jwts.parserBuilder().setSigningKey(secretKey).build();
            parser.parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    public List<String> extractAuthorities(String token) {
        JwtParser parser = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build();

        Claims claims = parser.parseClaimsJws(token).getBody();
        
        // Try to get authorities from multiple possible claim names
        List<String> authorities = claims.get("authorities", List.class);
        if (authorities == null) {
            authorities = claims.get("roles", List.class);
        }
        if (authorities == null) {
            String role = claims.get("role", String.class);
            if (role != null) {
                authorities = List.of(role);
            }
        }
        
        // Debug logging
        System.out.println("🔍 JWT Claims: " + claims);
        System.out.println("🔍 Extracted authorities: " + authorities);
        
        return authorities != null ? authorities : List.of();
    }

    public boolean validateToken(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
    final String username = extractUsername(token);
    return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        JwtParser parser = Jwts.parserBuilder().setSigningKey(secretKey).build();
        Date expiration = parser.parseClaimsJws(token).getBody().getExpiration();
        return expiration.before(new Date());
    }

}
