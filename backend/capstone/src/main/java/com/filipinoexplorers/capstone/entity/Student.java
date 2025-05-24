package com.filipinoexplorers.capstone.entity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = "classrooms")
@ToString(exclude = "classrooms")
public class Student implements User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String email;
    private String first_name;
    private String last_name;
    private String password;
    private LocalDate date_Of_birth;

    @Lob
    @Column(name = "profile_picture_data")
    private byte[] profilePictureData;

    @Enumerated(EnumType.STRING)
    private Role role = Role.STUDENT;

    @ManyToMany
    @JoinTable(
        name = "student_classroom",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "classroom_id")
    )
    @JsonIgnoreProperties("students")
    private Set<ClassRoom> classrooms = new HashSet<>();

    @Override
    public Long getId() {
        return studentId; // or just `id` if that’s your field name
    }

}
