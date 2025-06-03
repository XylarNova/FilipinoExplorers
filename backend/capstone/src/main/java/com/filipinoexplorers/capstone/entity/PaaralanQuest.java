package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaaralanQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String story;

    @Column(columnDefinition = "TEXT")
    private String question;

    @ElementCollection
    private List<String> choices;

    private int correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String hint;
}
