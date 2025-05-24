package com.filipinoexplorers.capstone.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionRequestDTO {
    private Long id;
    private String tagalogWord;
    private List<String> choices;
    private String correctAnswer;
    private String hint;
}