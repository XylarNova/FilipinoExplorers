package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.GroupGameSession;
import com.filipinoexplorers.capstone.service.GroupGameSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group-games")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class GroupGameSessionController {

    private final GroupGameSessionService sessionService;

    @PostMapping("/create")
    public GroupGameSession createSession(@RequestBody GroupGameSession session) {
        return sessionService.createSession(session);
    }

    @GetMapping("/all")
    public List<GroupGameSession> getAll() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/student/{studentId}")
    public List<GroupGameSession> getByStudent(@PathVariable Long studentId) {
        return sessionService.getSessionsByStudentId(studentId);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<GroupGameSession> getByTeacher(@PathVariable Long teacherId) {
        return sessionService.getSessionsByTeacherId(teacherId);
    }

    @PostMapping("/{sessionId}/join/{studentId}")
    public GroupGameSession joinSession(@PathVariable Long sessionId, @PathVariable Long studentId) {
        return sessionService.joinSession(sessionId, studentId);
    }
}
