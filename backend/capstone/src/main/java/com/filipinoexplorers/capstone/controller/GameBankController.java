package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.dto.GameBankRequestDTO;
import com.filipinoexplorers.capstone.dto.UpdateGameBankRequestDTO;
import com.filipinoexplorers.capstone.entity.GameBank;
import com.filipinoexplorers.capstone.entity.MGQuestion;
import com.filipinoexplorers.capstone.service.GameBankService;
import com.filipinoexplorers.capstone.repository.TeacherRepository;
import com.filipinoexplorers.capstone.service.JwtService;
import com.filipinoexplorers.capstone.entity.ClassRoom;
import com.filipinoexplorers.capstone.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gamesessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GameBankController {

    private final GameBankService gameSessionService;
    private final JwtService jwtService;
    private final TeacherRepository teacherRepository;
    private final ClassRoomRepository classRoomRepository;

    @GetMapping("/all")
    public ResponseEntity<List<GameBank>> getAllGameSessions() {
        return ResponseEntity.ok(gameSessionService.getAllGameSessions());
    }

    @GetMapping("/my-games")
    public ResponseEntity<?> getMyGames(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        return teacherRepository.findByEmail(email)
                .<ResponseEntity<?>>map(t -> ResponseEntity.ok(gameSessionService.getGamesByTeacher(t)))
                .orElseGet(() -> ResponseEntity.status(404).body("Teacher not found"));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<GameBank> getGameSessionById(@PathVariable Long id) {
        return gameSessionService.getGameSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/open/vocabulary")
    public ResponseEntity<List<GameBank>> getOpenVocabularyGames() {
        return ResponseEntity.ok(gameSessionService.getOpenVocabularyGames());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<GameBank>> getFilteredGameSessions(
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
            return ResponseEntity.ok(gameSessionService.getByClassrooms_Id(classRoomId));
        } else {
            return ResponseEntity.ok(gameSessionService.getAllGameSessions());
        }
    }

    @PostMapping("/post")
    public ResponseEntity<GameBank> createGameSession(@RequestBody GameBankRequestDTO request) {
        return ResponseEntity.ok(gameSessionService.createGameSessionFromDTO(request));
    }

  @PutMapping("/put/{id}")
    public ResponseEntity<?> updateGameSession(
        @PathVariable Long id,
        @RequestBody UpdateGameBankRequestDTO request
    ) {
        GameBank updated = gameSessionService.updateGameSessionFromDTO(id, request);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteGameSession(@PathVariable Long id) {
        gameSessionService.deleteGameSession(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/classroom/{classRoomId}")
    public ResponseEntity<List<GameBank>> getSessionsByClassRoom(@PathVariable Long classRoomId) {
        return ResponseEntity.ok(gameSessionService.getByClassrooms_Id(classRoomId));
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Missing status value");
        }
        GameBank session = gameSessionService.getGameSessionById(id)
                .orElseThrow(() -> new RuntimeException("GameSession not found"));
        session.setStatus(newStatus);
        return ResponseEntity.ok(gameSessionService.createGameSession(session));
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<GameBank> updateGameSessionStatus(@PathVariable Long id, @RequestBody Map<String, String> status) {
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
    public ResponseEntity<List<MGQuestion>> getVocabularyQuestionsByGameSessionId(@PathVariable Long id) {
        List<MGQuestion> questions = gameSessionService.getVocabularyQuestionsByGameSessionId(id);
        return ResponseEntity.ok(questions);
    }

    @PutMapping("/updateClass/{gameId}")
public ResponseEntity<?> updateClass(@PathVariable Long gameId, @RequestBody Map<String, List<Long>> body) {
    List<Long> classIds = body.get("classIds");

    if (classIds == null) {
        return ResponseEntity.badRequest().body("classIds field is missing");
    }

    return gameSessionService.getGameSessionById(gameId)
        .map(game -> {
            List<ClassRoom> classrooms = classRoomRepository.findAllById(classIds);
            game.setClassrooms(classrooms); // set full list
            game.setStatus(classrooms.isEmpty() ? "Draft" : "Closed");
            game.setLastModified(LocalDateTime.now());
            gameSessionService.saveGameSession(game);
            return ResponseEntity.ok(game);
        })
        .orElse(ResponseEntity.notFound().build());
}

}
