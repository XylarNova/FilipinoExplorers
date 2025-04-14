package com.filipinoexplorers.capstone.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class RegisterRequest {
    private String first_name;
    private String last_name;
    private String email;
    private String school;
    private LocalDate date_of_birth;
    private String password;
}
