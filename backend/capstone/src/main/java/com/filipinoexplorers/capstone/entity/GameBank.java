package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gameTitle;

    private String category; // e.g., Vocabulary, Grammar, etc.

    private boolean leaderboard;
    private boolean hints;
    private boolean review;
    private boolean shuffle;
    private boolean windowTracking;

    private Integer setTime; // In minutes
    private String quarter;
    private Integer gamePoints;

    private String status; 

    @UpdateTimestamp
    private LocalDateTime lastModified;

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private ClassRoom classRoom;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Question> questions;
}
