package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.StudentEntity;
import com.filipinoexplorers.capstone.service.StudentService;
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
@RequestMapping("/api/students") // Base URL for student-related endpoints
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from ReactJS frontend
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private JwtUtil jwtUtil;

    // Create a new student
    @PostMapping("/create")
    public ResponseEntity<StudentEntity> createStudent(@RequestBody StudentEntity student) {
        StudentEntity createdStudent = studentService.createStudent(student);
        return ResponseEntity.ok(createdStudent);
    }

    // Get all students
    @GetMapping("/get")
    public ResponseEntity<List<StudentEntity>> getAllStudents() {
        List<StudentEntity> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // Get a student by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<StudentEntity> getStudentById(@PathVariable Long id) {
        Optional<StudentEntity> student = studentService.getStudentById(id);
        return student.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // Update a student
    @PutMapping("/update/{id}")
    public ResponseEntity<StudentEntity> updateStudent(@PathVariable Long id, @RequestBody StudentEntity updatedStudent) {
        try {
            StudentEntity student = studentService.updateStudent(id, updatedStudent);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a student by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Login a student
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest loginRequest) {
        try {
            StudentEntity student = studentService.loginStudent(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(student.getEmail(), "student"); // Generate JWT token
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