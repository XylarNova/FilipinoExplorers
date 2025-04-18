package com.filipinoexplorers.capstone.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student implements User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String email;
    private String first_name;
    private String last_name;
    private String password;
    private LocalDate date_Of_birth;

    @Enumerated(EnumType.STRING)
    private Role role = Role.STUDENT;
}
