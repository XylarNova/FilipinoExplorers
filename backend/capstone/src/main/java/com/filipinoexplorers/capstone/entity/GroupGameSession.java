package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupGameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionName;

    @ManyToMany
    @JoinTable(
        name = "group_game_questions",
        joinColumns = @JoinColumn(name = "game_session_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<MGQuestion> questions;

    @ManyToMany
    @JoinTable(
        name = "group_game_students",
        joinColumns = @JoinColumn(name = "game_session_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> participants = new HashSet<>();

    private String status; // e.g., "Open", "In Progress", "Completed"

    private Long createdByTeacherId;

    private Long createdAtTimestamp;
}
