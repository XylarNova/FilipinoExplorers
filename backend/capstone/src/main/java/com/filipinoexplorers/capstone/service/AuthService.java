package com.filipinoexplorers.capstone.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.dto.AuthResponse;
import com.filipinoexplorers.capstone.dto.LoginRequest;
import com.filipinoexplorers.capstone.dto.RegisterRequest;
import com.filipinoexplorers.capstone.entity.Role;
import com.filipinoexplorers.capstone.entity.Student;
import com.filipinoexplorers.capstone.entity.Teacher;
import com.filipinoexplorers.capstone.entity.User;
import com.filipinoexplorers.capstone.repository.StudentRepository;
import com.filipinoexplorers.capstone.repository.TeacherRepository;

@Service
public class AuthService {

    @Autowired private TeacherRepository teacherRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    public AuthResponse register(RegisterRequest req) {
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        if ("TEACHER".equalsIgnoreCase(req.getRole())) {
            Teacher teacher = new Teacher();
            teacher.setEmail(req.getEmail());
            teacher.setFirst_name(req.getFirst_name());
            teacher.setLast_name(req.getLast_name());
            teacher.setPassword(encodedPassword);
            teacher.setSchool(req.getSchool());
            teacher.setRole(Role.TEACHER);

            teacherRepo.save(teacher);
            return new AuthResponse(jwtService.generateToken(teacher));
        } else {
            Student student = new Student();
            student.setEmail(req.getEmail());
            student.setFirst_name(req.getFirst_name());
            student.setLast_name(req.getLast_name());
            student.setPassword(encodedPassword);
            student.setDate_Of_birth(req.getDate_of_birth());
            student.setRole(Role.STUDENT);

            studentRepo.save(student);
            return new AuthResponse(jwtService.generateToken(student));
        }
    }

    public AuthResponse login(LoginRequest req) {
        Optional<? extends User> userOpt =
                teacherRepo.findByEmail(req.getEmail()).map(u -> (User) u)
                .or(() -> studentRepo.findByEmail(req.getEmail()).map(u -> (User) u));

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        return new AuthResponse(jwtService.generateToken(user));
    }
}
