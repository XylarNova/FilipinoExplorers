package com.filipinoexplorers.capstone.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.dto.AuthResponse;
import com.filipinoexplorers.capstone.dto.RegisterRequest;
import com.filipinoexplorers.capstone.entity.Teacher;
import com.filipinoexplorers.capstone.repository.TeacherRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final HttpSession session;

    public AuthResponse registerTeacher(RegisterRequest request) {
        if (teacherRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already taken");
        }

        Teacher teacher = Teacher.builder()
                .first_name(request.getFirst_name())
                .last_name(request.getLast_name())
                .email(request.getEmail())
                .school(request.getSchool())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("teacher")
                .build();

        teacherRepository.save(teacher);
        Long teacherId = teacher.getTeacher_id();

        String token = jwtService.generateToken(teacher.getEmail());

        // Save to session
        session.setAttribute("userEmail", teacher.getEmail());

        return new AuthResponse(token, teacherId, "Teacher registered successfully", teacher.getRole());
    }

    public AuthResponse loginTeacher(String email, String password) {
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    
        if (!passwordEncoder.matches(password, teacher.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
    
        String token = jwtService.generateToken(email);
    
        // Save to session
        session.setAttribute("userEmail", email);
    
        return new AuthResponse(token, teacher.getTeacher_id(), "Login successful", teacher.getRole());
    }
    
}
