package com.filipinoexplorers.capstone.mapper;

public class PaaralanQuestMapper {

    public static com.filipinoexplorers.capstone.entity.PaaralanQuest toEntity(com.filipinoexplorers.capstone.dto.PaaralanQuestRequest request) {
        com.filipinoexplorers.capstone.entity.PaaralanQuest quest = new com.filipinoexplorers.capstone.entity.PaaralanQuest();
        quest.setStory(request.getStory());
        quest.setQuestion(request.getQuestion());
        quest.setChoices(request.getChoices());
        quest.setCorrectAnswer(request.getCorrectAnswer());
        quest.setHint(request.getHint());
        return quest;
    }

    public static com.filipinoexplorers.capstone.dto.PaaralanQuestResponse toResponse(com.filipinoexplorers.capstone.entity.PaaralanQuest entity) {
        com.filipinoexplorers.capstone.dto.PaaralanQuestResponse response = new com.filipinoexplorers.capstone.dto.PaaralanQuestResponse();
        response.setId(entity.getId());
        response.setStory(entity.getStory());
        response.setQuestion(entity.getQuestion());
        response.setChoices(entity.getChoices());
        response.setCorrectAnswer(entity.getCorrectAnswer());
        response.setHint(entity.getHint());
        return response;
    }
    
}
