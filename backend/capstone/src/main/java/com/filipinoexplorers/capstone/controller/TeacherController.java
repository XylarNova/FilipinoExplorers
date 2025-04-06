package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.TeacherEntity;
import com.filipinoexplorers.capstone.service.TeacherService;
import com.filipinoexplorers.capstone.dto.LoginRequest;
import com.filipinoexplorers.capstone.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/teachers") // Base URL for teacher-related endpoints
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from ReactJS frontend
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private JwtUtil jwtUtil;

    // Create a new teacher
    @PostMapping("/create")
    public ResponseEntity<TeacherEntity> createTeacher(@RequestBody TeacherEntity teacher) {
        TeacherEntity createdTeacher = teacherService.createTeacher(teacher);
        return ResponseEntity.ok(createdTeacher);
    }

    // Get all teachers
    @GetMapping("/get")
    public ResponseEntity<List<TeacherEntity>> getAllTeachers() {
        List<TeacherEntity> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    // Get a teacher by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<TeacherEntity> getTeacherById(@PathVariable Long id) {
        Optional<TeacherEntity> teacher = teacherService.getTeacherById(id);
        return teacher.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // Update a teacher
    @PutMapping("/update/{id}")
    public ResponseEntity<TeacherEntity> updateTeacher(@PathVariable Long id, @RequestBody TeacherEntity updatedTeacher) {
        try {
            TeacherEntity teacher = teacherService.updateTeacher(id, updatedTeacher);
            return ResponseEntity.ok(teacher);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a teacher by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        try {
            teacherService.deleteTeacher(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Login a teacher
    @PostMapping("/login")
    public ResponseEntity<?> loginTeacher(@RequestBody LoginRequest loginRequest) {
        try {
            TeacherEntity teacher = teacherService.loginTeacher(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(teacher.getEmail(), "teacher"); // Generate JWT token
            return ResponseEntity.ok(Map.of("token", token)); // Return the token in a JSON object
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // Decode token to extract role
    @PostMapping("/decode-token")
    public ResponseEntity<?> decodeToken(@RequestHeader("Authorization") String token) {
        try {
            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String role = jwtUtil.extractRole(token); // Extract role from token
            return ResponseEntity.ok(Map.of("role", role)); // Return the role in a JSON object
        } catch (JwtException | IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }
}