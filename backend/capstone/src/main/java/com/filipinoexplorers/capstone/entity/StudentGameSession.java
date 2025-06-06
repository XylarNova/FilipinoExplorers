package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentGameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private GameBank gameBank;

    private LocalDateTime dateStarted;
    private LocalDateTime dateCompleted;

    private int score;
    private long totalTimeSeconds;

    private boolean cheatingDetected;

    @Enumerated(EnumType.STRING)
    private GameStatus status;

    public enum GameStatus {
        NOT_STARTED,
        ONGOING,
        COMPLETED
    }
}
