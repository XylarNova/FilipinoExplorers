package com.filipinoexplorers.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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

    @ManyToMany
    @JoinTable(
        name = "gamebank_classroom",
        joinColumns = @JoinColumn(name = "gamebank_id"),
        inverseJoinColumns = @JoinColumn(name = "classroom_id")
    )
    @JsonManagedReference
    private List<ClassRoom> classrooms;

   @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "gamebank_vocabulary_questions",
        joinColumns = @JoinColumn(name = "gamebank_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    @JsonManagedReference
    private List<MGQuestion> vocabularyQuestions;


    // ✅ NEW: Track the teacher who created this game
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
}
