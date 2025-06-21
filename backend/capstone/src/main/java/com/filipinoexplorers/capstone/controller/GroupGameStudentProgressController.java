package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.GroupGameStudentProgress;
import com.filipinoexplorers.capstone.service.GroupGameStudentProgressService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group-progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GroupGameStudentProgressController {

    private final GroupGameStudentProgressService service;

    @PostMapping("/update")
    public GroupGameStudentProgress updateProgress(@RequestBody ProgressRequest request) {
        return service.recordProgress(
                request.getStudentId(),
                request.getSessionId(),
                request.getCorrectAnswers(),
                request.getTotalAnswered(),
                request.getTimeSpentInSeconds(),
                request.getStatus()
        );
    }

    @GetMapping("/student/{studentId}")
    public List<GroupGameStudentProgress> getByStudent(@PathVariable Long studentId) {
        return service.getProgressForStudent(studentId);
    }

    @GetMapping("/{sessionId}")
    public List<GroupGameStudentProgress> getBySession(@PathVariable Long sessionId) {
        return service.getProgressForSession(sessionId);
    }

    @Data
    public static class ProgressRequest {
        private Long studentId;
        private Long sessionId;
        private int totalAnswered;
        private int correctAnswers;
        private long timeSpentInSeconds;
        private String status;
    }
}
