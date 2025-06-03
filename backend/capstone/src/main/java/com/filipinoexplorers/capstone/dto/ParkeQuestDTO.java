package com.filipinoexplorers.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParkeQuestDTO {
    private String story;
    private String question;
    private String correctAnswer;
    private List<String> choices;
    private String hint;

}