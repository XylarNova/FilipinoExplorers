package com.filipinoexplorers.capstone.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParkeQuestAnswerDTO {
    private Long questionId;
    private String selectedAnswer;
    private boolean usedHint;
}