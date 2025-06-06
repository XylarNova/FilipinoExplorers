package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.StudentGameSession;
import com.filipinoexplorers.capstone.service.StudentGameSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress-tracking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressTrackingController {

    private final StudentGameSessionService sessionService;

    @GetMapping("/classroom/{classroomId}")
    public List<StudentGameSession> getProgress(@PathVariable Long classroomId) {
        return sessionService.getProgressByClassroom(classroomId);
    }
}
