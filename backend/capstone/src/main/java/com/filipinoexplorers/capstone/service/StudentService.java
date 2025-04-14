package com.filipinoexplorers.capstone.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.dto.AuthResponse;
import com.filipinoexplorers.capstone.dto.RegisterRequest;
import com.filipinoexplorers.capstone.entity.Student;
import com.filipinoexplorers.capstone.repository.StudentRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final HttpSession session;

    public AuthResponse registerStudent(RegisterRequest request) {
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already taken");
        }

        Student student = Student.builder()
                .firstName(request.getFirst_name())
                .lastName(request.getLast_name())
                .dateOfBirth(request.getDate_of_birth())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("student")
                .build();

        studentRepository.save(student);
        Long studentId = student.getStudentId();

        String token = jwtService.generateToken(student.getEmail());

        session.setAttribute("userEmail", student.getEmail());

        return new AuthResponse(token, studentId, "Student registered successfully", student.getRole());
    }

    public AuthResponse loginStudent(String email, String password) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    
        if (!passwordEncoder.matches(password, student.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
    
        String token = jwtService.generateToken(email);
    
        // Save to session
        session.setAttribute("userEmail", email);
    
        return new AuthResponse(token, student.getStudentId(), "Login successful", student.getRole());
    }
    
}
