package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.*;
import com.filipinoexplorers.capstone.repository.*;
import com.filipinoexplorers.capstone.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/teacher-dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherDashboardController {

    private final JwtService jwtService;
    private final TeacherRepository teacherRepo;
    private final ClassRoomRepository classRoomRepo;
    private final StudentRepository studentRepo;
    private final GameBankRepository gameBankRepo;

    // ✅ 1. SUMMARY: total classes, students, active modules
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Integer>> getDashboardSummary(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        Teacher teacher = teacherRepo.findByEmail(email).orElseThrow();

        List<ClassRoom> teacherClasses = classRoomRepo.findByTeacher(teacher);
        int totalClasses = teacherClasses.size();

        int totalStudents = teacherClasses.stream()
                .mapToInt(c -> c.getStudents().size())
                .sum();

        int activeModules = 0;
        for (ClassRoom classroom : teacherClasses) {
            List<GameBank> games = gameBankRepo.findByClassrooms_Id(classroom.getId());
            activeModules += games.stream().filter(g -> "OPEN".equalsIgnoreCase(g.getStatus())).count();
        }

        Map<String, Integer> result = new HashMap<>();
        result.put("totalClasses", totalClasses);
        result.put("totalStudents", totalStudents);
        result.put("activeModules", activeModules);

        return ResponseEntity.ok(result);
    }

    // ✅ 2. CLASS OVERVIEW: list of class details
    @GetMapping("/class-overview")
    public ResponseEntity<List<Map<String, Object>>> getClassOverview(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        Teacher teacher = teacherRepo.findByEmail(email).orElseThrow();
        List<ClassRoom> classes = classRoomRepo.findByTeacher(teacher);

        List<Map<String, Object>> overviewList = new ArrayList<>();

        for (ClassRoom classroom : classes) {
            Map<String, Object> classData = new HashMap<>();
            classData.put("className", classroom.getName());
            classData.put("studentCount", classroom.getStudents().size());

            List<GameBank> games = gameBankRepo.findByClassrooms_Id(classroom.getId());
            long activeModules = games.stream().filter(g -> "OPEN".equalsIgnoreCase(g.getStatus())).count();
            classData.put("moduleCount", activeModules);

            Optional<LocalDateTime> latestActivity = games.stream()
                    .map(GameBank::getLastModified)
                    .filter(Objects::nonNull)
                    .max(LocalDateTime::compareTo);

            boolean isActive = latestActivity
                    .map(ts -> ts.isAfter(LocalDateTime.now().minusDays(60)))
                    .orElse(false);

            classData.put("status", isActive ? "Active" : "Inactive");

            overviewList.add(classData);
        }

        return ResponseEntity.ok(overviewList);
    }
}
