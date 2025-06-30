package com.filipinoexplorers.capstone.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Column(unique = true)
    private String customStudentId;
     
    @Column(name = "last_password_change")
    private LocalDateTime lastPasswordChange;


    private String email;
    private String first_name;
    private String last_name;
    private String password;
    private LocalDate date_Of_birth;
    
    @Column(name = "profile_picture_data")
    private String profilePictureUrl;

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

    //relationship to puzzles that student has played
    @ManyToMany
    @JoinTable(
        name = "student_puzzle",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "puzzle_id")
    )
    @JsonIgnoreProperties("playedByStudents")
    private Set<GuessTheWordEntity> playedPuzzles = new HashSet<>();

    @Override
    public Long getId() {
        return studentId;
    }
}
