package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.GuessTheWordEntity;
import com.filipinoexplorers.capstone.entity.Teacher;
import com.filipinoexplorers.capstone.repository.TeacherRepository;
import com.filipinoexplorers.capstone.service.GuessTheWordService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
 
@RestController
@RequestMapping("/api/gtw")
//@CrossOrigin(origins = "http://localhost:5173") // For development only
@RequiredArgsConstructor
public class GuessTheWordController {
    @Autowired
    private GuessTheWordService guessServ;

    @Autowired
    private TeacherRepository teacherRepository;

    @GetMapping("/word-puzzles")
    public List<GuessTheWordEntity> getAllPuzzles() {
        return guessServ.getAllPuzzles();
    }
    
    @GetMapping("/active-puzzles")
    public List<GuessTheWordEntity> getActivePuzzles() {
        return guessServ.getActivePuzzles();
    }

    @GetMapping("/word-puzzles/{id}")
    public ResponseEntity<GuessTheWordEntity> getPuzzleById(@PathVariable Long id) {
        Optional<GuessTheWordEntity> puzzle = guessServ.getPuzzleById(id);
        return puzzle.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/first-active-puzzle")
    public ResponseEntity<GuessTheWordEntity> getFirstActivePuzzle(
            @RequestParam(required = false) Long studentId) {
        Optional<GuessTheWordEntity> puzzle = guessServ.getFirstActivePuzzle(studentId);
        return puzzle.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Teacher management interface endpoints
    @PostMapping("/word-puzzles") //teacher
    public ResponseEntity<GuessTheWordEntity> createPuzzle(@RequestBody GuessTheWordEntity puzzle, @AuthenticationPrincipal(required = false) UserDetails userDetails) {
        // Get the teacher's email from the authenticated principal
    String email = userDetails.getUsername();
    Teacher teacher = teacherRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Teacher not found"));

    puzzle.setTeacher(teacher);
        GuessTheWordEntity savedPuzzle = guessServ.savePuzzle(puzzle);
        return new ResponseEntity<>(savedPuzzle, HttpStatus.CREATED);
    }

    
    
    @PutMapping("/word-puzzles/{id}")//teacher
    public ResponseEntity<GuessTheWordEntity> updatePuzzle(
            @PathVariable Long id, 
            @RequestBody GuessTheWordEntity puzzle) {
        
        Optional<GuessTheWordEntity> existingPuzzle = guessServ.getPuzzleById(id);
        
        if (!existingPuzzle.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Set the ID to ensure we're updating the right record
        puzzle.setId(id);
        GuessTheWordEntity updatedPuzzle = guessServ.savePuzzle(puzzle);
        
        return ResponseEntity.ok(updatedPuzzle);
    }
    
    @PutMapping("/word-puzzles/{id}/score")//teacher
    public ResponseEntity<GuessTheWordEntity> updatePuzzleScore(
            @PathVariable Long id, 
            @RequestBody Map<String, Integer> scoreMap) {
        
        Integer score = scoreMap.get("score");
        if (score == null) {
            return ResponseEntity.badRequest().build();
        }
        
        GuessTheWordEntity updatedPuzzle = guessServ.updatePuzzleScore(id, score);
        if (updatedPuzzle == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(updatedPuzzle);
    }
    
    @PutMapping("/word-puzzles/{id}/hint-status")//teacher
    public ResponseEntity<GuessTheWordEntity> updateHintStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, Boolean> hintStatusMap) {
        
        Boolean hintEnabled = hintStatusMap.get("hintEnabled");
        if (hintEnabled == null) {
            return ResponseEntity.badRequest().build();
        }
        
        GuessTheWordEntity updatedPuzzle = guessServ.updateHintStatus(id, hintEnabled);
        if (updatedPuzzle == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(updatedPuzzle);
    }
    
    @DeleteMapping("/word-puzzles/{id}")//teacher 
    public ResponseEntity<Map<String, Boolean>> deletePuzzle(@PathVariable Long id) {
        Optional<GuessTheWordEntity> puzzle = guessServ.getPuzzleById(id);
        
        if (!puzzle.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        guessServ.deletePuzzle(id);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        
        return ResponseEntity.ok(response);
    }
    
    // Endpoint to set active puzzles for gameplay
    @PostMapping("/active-puzzles")
    public ResponseEntity<Map<String, Object>> setActivePuzzles(@RequestBody Map<String, List<Long>> request) {
        List<Long> puzzleIds = request.get("puzzleIds");
        
        if (puzzleIds == null) {
            return ResponseEntity.badRequest().build();
        }
        
        guessServ.setActivePuzzles(puzzleIds);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", puzzleIds.size() + " puzzles set for active gameplay");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-answer")
    public ResponseEntity<Map<String, Object>> checkAnswer(
            @RequestBody Map<String, Object> request) {
        
        Long puzzleId = Long.parseLong(request.get("puzzleId").toString());
        String answer = (String) request.get("answer");
        Long studentId = request.get("studentId") != null ? 
            Long.parseLong(request.get("studentId").toString()) : null;
        
        boolean isCorrect;
        
        // Use enhanced method if studentId is provided
        if (studentId != null) {
            isCorrect = guessServ.checkAnswerWithStudentTracking(puzzleId, answer, studentId);
        } else {
            isCorrect = guessServ.checkAnswer(puzzleId, answer);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("correct", isCorrect);
        
        if (isCorrect) {
            // Get the puzzle to return the score
            Optional<GuessTheWordEntity> puzzleOpt = guessServ.getPuzzleById(puzzleId);
            if (puzzleOpt.isPresent()) {
                response.put("score", puzzleOpt.get().getScore());
            }
            
            response.put("message", "Tama!");
            
            // Return next puzzle if available
            Optional<GuessTheWordEntity> nextPuzzle = guessServ.getNextPuzzle(puzzleId, studentId);
            if (nextPuzzle.isPresent()) {
                response.put("nextPuzzle", nextPuzzle.get());
            } else {
                response.put("gameComplete", true);
            }
        } else {
            response.put("message", "Mali. Subukan muli!");
        }
        
        return ResponseEntity.ok(response);
    }

    /*@GetMapping("/hint/{puzzleId}")
    public ResponseEntity<Map<String, Object>> getHint(@PathVariable Long puzzleId) {
        Optional<GuessTheWordEntity> puzzleOpt = guessServ.getPuzzleById(puzzleId);
        
        Map<String, Object> response = new HashMap<>();
        
        if (!puzzleOpt.isPresent()) {
            response.put("error", "Puzzle not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        GuessTheWordEntity puzzle = puzzleOpt.get();
        
        // Check if hints are enabled for this puzzle
        if (puzzle.getHintEnabled() != null && !puzzle.getHintEnabled()) {
            response.put("available", false);
            response.put("message", "Hints are disabled for this puzzle");
            return ResponseEntity.ok(response);
        }
        
        // Hints are enabled, return the hint
        response.put("available", true);
        response.put("hint", puzzle.getHint());
        
        return ResponseEntity.ok(response);
    }*/
    
    // Updated translation endpoint to use the dedicated translation field
    @GetMapping("/translation/{puzzleId}")
    public ResponseEntity<Map<String, String>> getTranslation(@PathVariable Long puzzleId) {
        Optional<GuessTheWordEntity> puzzleOpt = guessServ.getPuzzleById(puzzleId);
        
        if (!puzzleOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        GuessTheWordEntity puzzle = puzzleOpt.get();
        Map<String, String> response = new HashMap<>();
        
        // Use the dedicated translation field if available
        if (puzzle.getTranslation() != null && !puzzle.getTranslation().isEmpty()) {
            response.put("translation", puzzle.getTranslation());
        } else {
            // Fallback to a placeholder if not set
            response.put("translation", "Translation not available");
        }
        
        return ResponseEntity.ok(response);
    }
    
    // Student progress tracking endpoints
    
    @GetMapping("/student/{studentId}/completed-puzzles")
    public ResponseEntity<List<GuessTheWordEntity>> getStudentCompletedPuzzles(
            @PathVariable Long studentId) {
        List<GuessTheWordEntity> completedPuzzles = guessServ.getStudentCompletedPuzzles(studentId);
        return ResponseEntity.ok(completedPuzzles);
    }
    
    @GetMapping("/student/{studentId}/unplayed-puzzles")
    public ResponseEntity<List<GuessTheWordEntity>> getUnplayedPuzzlesForStudent(
            @PathVariable Long studentId) {
        List<GuessTheWordEntity> unplayedPuzzles = guessServ.getUnplayedPuzzlesForStudent(studentId);
        return ResponseEntity.ok(unplayedPuzzles);
    }
    
    @GetMapping("/student/{studentId}/progress")
    public ResponseEntity<Map<String, Object>> getStudentProgress(
            @PathVariable Long studentId) {
        
        List<GuessTheWordEntity> completedPuzzles = guessServ.getStudentCompletedPuzzles(studentId);
        List<GuessTheWordEntity> unplayedPuzzles = guessServ.getUnplayedPuzzlesForStudent(studentId);
        Integer totalScore = guessServ.getStudentTotalScore(studentId);
        
        Map<String, Object> progress = new HashMap<>();
        progress.put("studentId", studentId);
        progress.put("completedPuzzles", completedPuzzles);
        progress.put("unplayedPuzzles", unplayedPuzzles);
        progress.put("totalCompleted", completedPuzzles.size());
        progress.put("totalRemaining", unplayedPuzzles.size());
        progress.put("totalScore", totalScore);
        progress.put("completionPercentage", 
            calculateCompletionPercentage(completedPuzzles.size(), unplayedPuzzles.size()));
        
        return ResponseEntity.ok(progress);
    }
    
    @GetMapping("/student/{studentId}/puzzle/{puzzleId}/completed")
    public ResponseEntity<Map<String, Boolean>> hasStudentCompletedPuzzle(
            @PathVariable Long studentId, 
            @PathVariable Long puzzleId) {
        
        boolean completed = guessServ.hasStudentCompletedPuzzle(studentId, puzzleId);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("completed", completed);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/student/{studentId}/reset-progress")
    public ResponseEntity<Map<String, Object>> resetStudentProgress(
            @PathVariable Long studentId) {
        
        guessServ.resetStudentProgress(studentId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Student progress has been reset");
        response.put("studentId", studentId);
        
        return ResponseEntity.ok(response);
    }
    
    // Helper method to calculate completion percentage
    private double calculateCompletionPercentage(int completed, int remaining) {
        int total = completed + remaining;
        if (total == 0) {
            return 0.0;
        }
        return (double) completed / total * 100.0;
    }
}