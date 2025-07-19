package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.PaaralanQuestScore;
import com.filipinoexplorers.capstone.service.PaaralanQuestScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paaralan-quest/score")
public class PaaralanQuestScoreController {

    private final PaaralanQuestScoreService scoreService;

    @Autowired
    public PaaralanQuestScoreController(PaaralanQuestScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping("/submit")
    public ResponseEntity<PaaralanQuestScore> submitScore(@RequestBody PaaralanQuestScore score) {
        PaaralanQuestScore saved = scoreService.saveScore(score);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PaaralanQuestScore>> getAllScores() {
        return ResponseEntity.ok(scoreService.getAllScores());
    }
}
