package com.filipinoexplorers.capstone.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "your-256-bit-secret-your-256-bit-secret"; // Replace with a secure key
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    /**
     * Generate a JWT token with email and role.
     *
     * @param email The email of the user.
     * @param role  The role of the user (e.g., "teacher" or "student").
     * @return The generated JWT token.
     */
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email) // Set the email as the subject
                .claim("role", role) // Add the role as a custom claim
                .setIssuedAt(new Date()) // Set the issued date
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Set expiration
                .signWith(key, SignatureAlgorithm.HS256) // Sign the token with the secret key
                .compact();
    }

    /**
     * Validate a JWT token.
     *
     * @param token The JWT token to validate.
     * @return True if the token is valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Log the exception if needed
            return false;
        }
    }

    /**
     * Extract the email (subject) from the token.
     *
     * @param token The JWT token.
     * @return The email extracted from the token.
     */
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract the role from the token.
     *
     * @param token The JWT token.
     * @return The role extracted from the token.
     */
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    /**
     * Extract all claims from the token.
     *
     * @param token The JWT token.
     * @return The claims contained in the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}