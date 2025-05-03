package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tagalogWord;

    private String correctAnswer;

    @ElementCollection
    private List<String> choices;

    private String hint;

    private int timerInSeconds;

    private int points;
}
