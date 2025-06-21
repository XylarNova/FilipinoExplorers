package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "group_game_session_id"}))
public class GroupGameStudentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to the student
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    // Reference to the group game session
    @ManyToOne
    @JoinColumn(name = "group_game_session_id")
    private GroupGameSession groupGameSession;

    private int totalQuestionsAnswered;
    private int correctAnswers;
    private long timeSpentInSeconds; 
    private String status; 
}
