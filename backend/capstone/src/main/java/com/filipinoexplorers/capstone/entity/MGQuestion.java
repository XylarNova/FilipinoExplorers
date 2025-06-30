package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MGQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tagalogWord;
    private String correctAnswer;

    @ElementCollection
    private List<String> choices;

    private String hint;

    @ManyToMany(mappedBy = "vocabularyQuestions")
    private List<GameBank> gameSessions;
}
