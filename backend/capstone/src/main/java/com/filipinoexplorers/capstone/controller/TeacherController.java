package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.dto.TeacherIdDTO;
import com.filipinoexplorers.capstone.entity.Teacher;
import com.filipinoexplorers.capstone.repository.TeacherRepository;
import com.filipinoexplorers.capstone.service.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {

    private final TeacherRepository teacherRepository;
    private final JwtService jwtService;

        @GetMapping("/me")
        public ResponseEntity<TeacherIdDTO> getCurrentTeacher(@RequestHeader("Authorization") String authHeader) {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401
            }

            try {
                String token = authHeader.substring(7);
                String email = jwtService.extractUsername(token);

                return teacherRepository.findByEmail(email)
                    .map(teacher -> ResponseEntity.ok(new TeacherIdDTO(teacher.getTeacherId())))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 fallback
            }
        }



}
