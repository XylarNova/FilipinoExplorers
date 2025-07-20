package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "paaralan_quest_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaaralanQuestScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private Integer totalScore;

    private LocalDateTime timestamp;

    @PrePersist
        protected void onCreate() {
        this.timestamp = LocalDateTime.now();
}

}