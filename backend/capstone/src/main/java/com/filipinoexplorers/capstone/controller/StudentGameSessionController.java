package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.Student;
import com.filipinoexplorers.capstone.entity.StudentGameSession;
import com.filipinoexplorers.capstone.entity.StudentGameSession.GameStatus;
import com.filipinoexplorers.capstone.repository.StudentGameSessionRepository;
import com.filipinoexplorers.capstone.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student-game-session")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StudentGameSessionController {

    private final StudentRepository studentRepository;
    private final StudentGameSessionRepository sessionRepository;

    @GetMapping("/student/played")
    public ResponseEntity<List<Long>> getPlayedGameIds(Principal principal) {
        String email = principal.getName(); // Extracted from JWT token via Spring Security

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Long> completedGameIds = sessionRepository
                .findByStudent_StudentIdAndStatus(student.getStudentId(), GameStatus.COMPLETED)
                .stream()
                .map(session -> session.getGameBank().getId())
                .toList();

        return ResponseEntity.ok(completedGameIds);
    }
}
