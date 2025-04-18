package com.filipinoexplorers.capstone.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UserDetailsResponse {
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String profilePictureUrl;
    private String school;
    private LocalDate date_Of_birth;
    private boolean hasProfilePicture;
}
