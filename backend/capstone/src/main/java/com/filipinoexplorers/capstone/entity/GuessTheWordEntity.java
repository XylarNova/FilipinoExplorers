package com.filipinoexplorers.capstone.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "word_puzzles")
public class GuessTheWordEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String word;
    private String clue;
    private String shuffledLetters;
    private String hint;
    // Add new field for translation
    private String translation;
    private Integer score = 10; // Default score of 10
    private Boolean active = false; // Flag to mark puzzles selected for gameplay
    private Boolean hintEnabled = true; // Default to enabled

    @ManyToMany(mappedBy = "playedPuzzles")
    @JsonIgnoreProperties("playedPuzzles")
    private Set<Student> playedByStudents = new HashSet<>();
    
    // Default constructor
    public GuessTheWordEntity() {}
    
    // Constructor with parameters
    public GuessTheWordEntity(String word, String clue, String shuffledLetters, String hint, String translation, Integer score, Boolean hintEnabled) {
        this.word = word;
        this.clue = clue;
        this.shuffledLetters = shuffledLetters;
        this.hint = hint;
        this.translation = translation;
        this.score = score != null ? score : 10; // Default to 10 if not provided
        this.hintEnabled = hintEnabled != null ? hintEnabled : true; // Default to true if not provided
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getWord() {
        return word;
    }
    
    public void setWord(String word) {
        this.word = word;
    }
    
    public String getClue() {
        return clue;
    }
    
    public void setClue(String clue) {
        this.clue = clue;
    }
    
    public String getShuffledLetters() {
        return shuffledLetters;
    }
    
    public void setShuffledLetters(String shuffledLetters) {
        this.shuffledLetters = shuffledLetters;
    }
    
    public String getHint() {
        return hint;
    }
    
    public void setHint(String hint) {
        this.hint = hint;
    }
    
    public String getTranslation() {
        return translation;
    }
    
    public void setTranslation(String translation) {
        this.translation = translation;
    }
    
    public Integer getScore() {
        return score;
    }
    
    public void setScore(Integer score) {
        this.score = score;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public Boolean getHintEnabled() {
        return hintEnabled;
    }
    
    public void setHintEnabled(Boolean hintEnabled) {
        this.hintEnabled = hintEnabled;
    }

    public Set<Student> getPlayedByStudents() {
        return playedByStudents;
    }
    
    public void setPlayedByStudents(Set<Student> playedByStudents) {
        this.playedByStudents = playedByStudents;
    }
}