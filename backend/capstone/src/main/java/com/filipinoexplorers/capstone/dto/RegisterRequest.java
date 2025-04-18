package com.filipinoexplorers.capstone.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String email;
    private String first_name;
    private String last_name;
    private String password;
    private String role;
    private String school;
    private LocalDate date_of_birth;
}
