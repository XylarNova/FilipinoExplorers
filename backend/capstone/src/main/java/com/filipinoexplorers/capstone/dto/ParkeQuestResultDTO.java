// ParkeQuestResultDTO.java
package com.filipinoexplorers.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ParkeQuestResultDTO {
    private boolean isCorrect;
    private int score;
    private String message;
}