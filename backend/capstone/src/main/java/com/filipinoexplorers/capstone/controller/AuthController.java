package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.dto.AuthResponse;
import com.filipinoexplorers.capstone.dto.LoginRequest;
import com.filipinoexplorers.capstone.dto.RegisterRequest;
import com.filipinoexplorers.capstone.dto.UserDetailsResponse;
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
    public ResponseEntity<AuthResponse> register(
            @RequestPart(value = "data", required = false) RegisterRequest multipartData,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestBody(required = false) RegisterRequest jsonData
    ) {
        try {
            // Use multipartData if it exists, otherwise fall back to JSON
            RegisterRequest request = multipartData != null ? multipartData : jsonData;

            if (request == null) {
                return ResponseEntity.badRequest().body(new AuthResponse("Invalid registration data."));
            }

            AuthResponse response = authService.register(request, profilePicture);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Server error occurred."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication) {
        try {
            String email = authentication.getName();
            UserDetailsResponse userDetails = authService.getUserDetails(email);

            return ResponseEntity.ok(userDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
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
                    return ResponseEntity.badRequest().body("Invalid date format. Use yyyy-MM-dd.");
                }
            }

            UserDetailsResponse updatedUser = authService.updateProfile(
                    email, firstName, lastName, school, dob, profilePicture
            );

            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            System.err.println("Error updating profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile.");
        }
    }
}
