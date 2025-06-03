package com.filipinoexplorers.capstone.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ParkeQuestChoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String choice;

    @ManyToOne
    @JoinColumn(name = "parke_quest_question_id")
    @JsonBackReference
    private ParkeQuestQuestion question;


    // No need for manual getters/setters if you use @Getter and @Setter
}