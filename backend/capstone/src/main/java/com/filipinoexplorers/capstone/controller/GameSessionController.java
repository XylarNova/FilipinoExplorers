package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.GameSession;
import com.filipinoexplorers.capstone.entity.Question;
import com.filipinoexplorers.capstone.service.GameSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gamesessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GameSessionController {

    private final GameSessionService gameSessionService;

    @GetMapping("/all")
    public ResponseEntity<List<GameSession>> getAllGameSessions() {
        return ResponseEntity.ok(gameSessionService.getAllGameSessions());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<GameSession> getGameSessionById(@PathVariable Long id) {
        return gameSessionService.getGameSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/open/vocabulary")
    public ResponseEntity<List<GameSession>> getOpenVocabularyGames() {
        return ResponseEntity.ok(gameSessionService.getOpenVocabularyGames());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<GameSession>> getFilteredGameSessions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String quarter,
            @RequestParam(required = false) Boolean review,
            @RequestParam(required = false) Boolean leaderboard,
            @RequestParam(required = false) Boolean hints,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long classRoomId
    ) {
        if (category != null && quarter != null && review != null) {
            return ResponseEntity.ok(gameSessionService.getByCategoryAndQuarterAndReview(category, quarter, review));
        } else if (category != null && quarter != null) {
            return ResponseEntity.ok(gameSessionService.getByCategoryAndQuarter(category, quarter));
        } else if (category != null && review != null) {
            return ResponseEntity.ok(gameSessionService.getByCategoryAndReview(category, review));
        } else if (quarter != null && review != null) {
            return ResponseEntity.ok(gameSessionService.getByQuarterAndReview(quarter, review));
        } else if (category != null) {
            return ResponseEntity.ok(gameSessionService.getByCategory(category));
        } else if (quarter != null) {
            return ResponseEntity.ok(gameSessionService.getByQuarter(quarter));
        } else if (review != null) {
            return ResponseEntity.ok(gameSessionService.getByReview(review));
        } else if (leaderboard != null) {
            return ResponseEntity.ok(gameSessionService.getByLeaderboard(leaderboard));
        } else if (hints != null) {
            return ResponseEntity.ok(gameSessionService.getByHints(hints));
        } else if (status != null) {
            return ResponseEntity.ok(gameSessionService.getByStatus(status));
        } else if (classRoomId != null) {
            return ResponseEntity.ok(gameSessionService.getByClassRoomId(classRoomId));
        } else {
            return ResponseEntity.ok(gameSessionService.getAllGameSessions());
        }
    }

    @PostMapping("/post")
    public ResponseEntity<GameSession> createGameSession(@RequestBody GameSession gameSession) {
        return ResponseEntity.ok(gameSessionService.createGameSession(gameSession));
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<GameSession> updateGameSession(
            @PathVariable Long id,
            @RequestBody GameSession updatedSession
    ) {
        updatedSession.setLastModified(LocalDateTime.now());
        return ResponseEntity.ok(gameSessionService.updateGameSession(id, updatedSession));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteGameSession(@PathVariable Long id) {
        gameSessionService.deleteGameSession(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/classroom/{classRoomId}")
    public ResponseEntity<List<GameSession>> getSessionsByClassRoom(@PathVariable Long classRoomId) {
        return ResponseEntity.ok(gameSessionService.getByClassRoomId(classRoomId));
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Missing status value");
        }
        GameSession session = gameSessionService.getGameSessionById(id)
                .orElseThrow(() -> new RuntimeException("GameSession not found"));
        session.setStatus(newStatus);
        return ResponseEntity.ok(gameSessionService.createGameSession(session));
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<GameSession> updateGameSessionStatus(@PathVariable Long id, @RequestBody Map<String, String> status) {
        return gameSessionService.getGameSessionById(id)
                .map(gameSession -> {
                    gameSession.setStatus(status.get("status"));
                    gameSession.setLastModified(LocalDateTime.now());
                    gameSessionService.saveGameSession(gameSession);
                    return ResponseEntity.ok(gameSession);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/vocabulary-questions")
    public ResponseEntity<List<Question>> getVocabularyQuestionsByGameSessionId(@PathVariable Long id) {
        List<Question> questions = gameSessionService.getVocabularyQuestionsByGameSessionId(id);
        return ResponseEntity.ok(questions);
    }

}
