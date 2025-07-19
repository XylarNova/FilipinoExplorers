package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.PaaralanQuestScore;
import com.filipinoexplorers.capstone.repository.PaaralanQuestScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaaralanQuestScoreService {

    private final PaaralanQuestScoreRepository scoreRepository;

    @Autowired
    public PaaralanQuestScoreService(PaaralanQuestScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    public PaaralanQuestScore saveScore(PaaralanQuestScore score) {
        return scoreRepository.save(score);
    }

    public List<PaaralanQuestScore> getAllScores() {
        return scoreRepository.findAll();
    }
}