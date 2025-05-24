package com.filipinoexplorers.capstone.entity;

import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = "students")
@ToString(exclude = "students")
public class ClassRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String enrollmentMethod;
    private String bannerUrl;

    @Column(unique = true, nullable = false, updatable = false)
    private String classCode;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToMany(mappedBy = "classrooms")
    private Set<Student> students = new HashSet<>();
    @ManyToMany(mappedBy = "classrooms")
    @JsonBackReference
    private Set<GameBank> gameSessions = new HashSet<>();
}
