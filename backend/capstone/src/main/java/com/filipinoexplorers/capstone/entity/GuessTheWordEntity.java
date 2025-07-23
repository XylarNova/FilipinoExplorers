package com.filipinoexplorers.capstone.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "word_puzzles")
public class GuessTheWordEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String word;
    private String clue; //tagalog meaning
    private String shuffledLetters;
    private String translation; //english translation
    private Integer score = 10; // Default score 
    private Boolean active = false; // Flag to mark puzzles selected for gameplay
    private Boolean hintEnabled = true; // Default to enabled

    @ManyToMany(mappedBy = "playedPuzzles")
    @JsonIgnoreProperties("playedPuzzles")
    private Set<Student> playedByStudents = new HashSet<>();


    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonIgnoreProperties("createdPuzzles") // Prevents infinite recursion in JSON serialization
    private Teacher teacher;
    
    // Default constructor
    public GuessTheWordEntity() {}
    
    // Constructor with parameters
    public GuessTheWordEntity(String word, String clue, String shuffledLetters, String translation, Integer score, Boolean hintEnabled) {
        this.word = word;
        this.clue = clue; //tagalog meaning
        this.active = true; // word defaults to active when created 
        this.shuffledLetters = shuffledLetters; //for hint
        this.translation = translation; //english translation 
        this.score = score != null ? score : 10; // Default 10
        this.hintEnabled = hintEnabled != null ? hintEnabled : true; // Default true
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

    public Teacher getTeacher() {
    return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }
}