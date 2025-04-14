package com.filipinoexplorers.capstone.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.filipinoexplorers.capstone.dto.AuthResponse;
import com.filipinoexplorers.capstone.dto.LoginRequest;
import com.filipinoexplorers.capstone.dto.RegisterRequest;
import com.filipinoexplorers.capstone.service.StudentService;
import com.filipinoexplorers.capstone.service.TeacherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final TeacherService teacherService;
    private final StudentService studentService;

    @PostMapping("/register-teacher")
    public ResponseEntity<AuthResponse> registerTeacher(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(teacherService.registerTeacher(request));
    }

    @PostMapping("/register-student")
    public ResponseEntity<AuthResponse> registerStudent(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(studentService.registerStudent(request));
    }

    @PostMapping("/login-teacher")
    public ResponseEntity<AuthResponse> loginTeacher(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(teacherService.loginTeacher(request.getEmail(), request.getPassword()));
    }

    @PostMapping("/login-student")
    public ResponseEntity<AuthResponse> loginStudent(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(studentService.loginStudent(request.getEmail(), request.getPassword()));
    }
}
