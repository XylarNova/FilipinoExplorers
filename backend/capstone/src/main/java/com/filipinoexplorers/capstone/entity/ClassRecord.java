package com.filipinoexplorers.capstone.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private String activityScores; // e.g., "10,15,12"

    private int totalScore;

    public void calculateTotal() {
        if (activityScores != null && !activityScores.isEmpty()) {
            totalScore = List.of(activityScores.split(","))
                             .stream()
                             .mapToInt(Integer::parseInt)
                             .sum();
        }
    }
}

