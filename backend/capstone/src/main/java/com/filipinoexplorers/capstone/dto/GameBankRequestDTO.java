package com.filipinoexplorers.capstone.dto;

import lombok.Data;
import java.util.List;

@Data
public class GameBankRequestDTO {
    private String gameTitle;
    private String category;
    private boolean leaderboard;
    private boolean hints;
    private boolean review;
    private boolean shuffle;
    private boolean windowTracking;
    private Integer setTime;
    private String quarter;
    private Integer gamePoints;
    private String status;
    private List<Long> classRoomIds; 
    private List<Long> questionIds;
    private List<QuestionRequestDTO> vocabularyQuestions; // changed from entity to DTO
    private Long teacherId;
}
