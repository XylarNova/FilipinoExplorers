package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.dto.*;
import com.filipinoexplorers.capstone.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Server error occurred."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid credentials."));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Unauthorized: Invalid or missing token."));
        }

        try {
            String email = authentication.getName();
            UserDetailsResponse userDetails = authService.getUserDetails(email);
            return ResponseEntity.ok(userDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("User not found."));
        }
    }


    @PutMapping("/user/update")
    public ResponseEntity<?> updateUserProfile(
            Authentication authentication,
            @RequestBody UserDetailsResponse request
    ) {
        try {
            String email = authentication.getName();

            UserDetailsResponse updatedUser = authService.updateProfile(
                    email,
                    request.getFirstName(),
                    request.getLastName(),
                    request.getSchool(),
                    request.getProfilePictureUrl()
            );

            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            System.err.println("Error updating profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to update profile."));
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Missing or invalid Authorization header."));
            }

            String token = authHeader.substring(7);
            String message = authService.logout(token);
            return ResponseEntity.ok().body(new AuthResponse(null, message));

        } catch (Exception e) {
            System.err.println("Error during logout: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Logout failed."));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        boolean success = authService.changePassword(
                request.getEmail(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        if (success) {
            return ResponseEntity.ok("Password changed successfully.");
        } else {
            return ResponseEntity.badRequest().body("Current password is incorrect.");
        }
    }
}
