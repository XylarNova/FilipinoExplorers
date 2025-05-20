package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.dto.AuthResponse;
import com.filipinoexplorers.capstone.dto.ChangePasswordRequest;
import com.filipinoexplorers.capstone.dto.LoginRequest;
import com.filipinoexplorers.capstone.dto.RegisterRequest;
import com.filipinoexplorers.capstone.dto.UserDetailsResponse;
import com.filipinoexplorers.capstone.dto.ErrorResponse;
import com.filipinoexplorers.capstone.service.AuthService;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping(value = "/register", consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> register(
            @RequestPart(value = "data", required = false) RegisterRequest multipartData,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestBody(required = false) RegisterRequest jsonData
    ) {
        try {
            RegisterRequest request = multipartData != null ? multipartData : jsonData;

            if (request == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Invalid registration data."));
            }

            AuthResponse response = authService.register(request, profilePicture);
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
        try {
            String email = authentication.getName();
            UserDetailsResponse userDetails = authService.getUserDetails(email);

            return ResponseEntity.ok(userDetails);
        } catch (Exception e) {
            System.err.println("Error fetching user details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("User not found."));
        }
    }

    @PutMapping(value = "/user/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserProfile(
            Authentication authentication,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String school,
            @RequestParam(required = false) String dateOfBirth,
            @RequestParam(required = false) MultipartFile profilePicture
    ) {
        try {
            String email = authentication.getName();
            LocalDate dob = null;

            if (dateOfBirth != null && !dateOfBirth.isBlank()) {
                try {
                    dob = LocalDate.parse(dateOfBirth); // Format: yyyy-MM-dd
                } catch (DateTimeParseException e) {
                    return ResponseEntity.badRequest().body(new ErrorResponse("Invalid date format. Use yyyy-MM-dd."));
                }
            }

            UserDetailsResponse updatedUser = authService.updateProfile(
                    email, firstName, lastName, school, dob, profilePicture
            );

            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            System.err.println("Error updating profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Failed to update profile."));
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
