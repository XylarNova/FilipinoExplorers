package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
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

    @ManyToMany(mappedBy = "vocabularyQuestions")
    @JsonBackReference
    private List<GameBank> gameSessions;
}
