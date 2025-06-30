package com.filipinoexplorers.capstone.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Lob;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher implements User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherId;

     @Column(unique = true)
    private String customTeacherId;

    @Column(name = "last_password_change")
    private LocalDateTime lastPasswordChange;

    private String email;
    private String first_name;
    private String last_name;
    private String password;
    private String school;

    @Column(name = "profile_picture_data")
    private String profilePictureUrl;

    @Enumerated(EnumType.STRING)
    private Role role = Role.TEACHER;

    @Override
        public Long getId() {
            return teacherId;
        }

}

