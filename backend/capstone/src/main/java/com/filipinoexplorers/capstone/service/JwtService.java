package com.filipinoexplorers.capstone.service;

import java.util.Date;
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

    // Generate a secure key using Keys.secretKeyFor(SignatureAlgorithm)
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Generate Token
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(secretKey)
                .compact();
    }

    // Extract Username
    public String extractUsername(String token) {
        JwtParser parser = Jwts.parserBuilder().setSigningKey(secretKey).build();
        Claims claims = parser.parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    // Validate Token
    public boolean validateToken(String token) {
        try {
            JwtParser parser = Jwts.parserBuilder().setSigningKey(secretKey).build();
            parser.parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String extractRole(String token) {
        try {
            JwtParser parser = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build();
    
            Claims claims = parser.parseClaimsJws(token).getBody();
    
            return claims.get("role", String.class);  // Make sure you store "role" when generating the token
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract role from JWT", e);
        }
    }
    
}