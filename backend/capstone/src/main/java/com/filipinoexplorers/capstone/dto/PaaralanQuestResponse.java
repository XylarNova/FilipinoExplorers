package com.filipinoexplorers.capstone.dto;

import lombok.Data;

import java.util.List;

@Data
public class PaaralanQuestResponse {
    private Long id;
    private String story;
    private String question;
    private List<String> choices;
    private int correctAnswer;
    private String hint;
}
