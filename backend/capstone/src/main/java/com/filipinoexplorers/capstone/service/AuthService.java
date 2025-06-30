package com.filipinoexplorers.capstone.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.dto.*;
import com.filipinoexplorers.capstone.entity.*;
import com.filipinoexplorers.capstone.repository.*;

import jakarta.transaction.Transactional;

@Service
public class AuthService {

    @Autowired private TeacherRepository teacherRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    public AuthResponse register(RegisterRequest req) {
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        if ("TEACHER".equalsIgnoreCase(req.getRole())) {
            Teacher teacher = Teacher.builder()
                    .email(req.getEmail())
                    .first_name(req.getFirst_name())
                    .last_name(req.getLast_name())
                    .password(encodedPassword)
                    .school(req.getSchool())
                    .role(Role.TEACHER)
                    .build();

            Teacher savedTeacher = teacherRepo.save(teacher);
            savedTeacher.setLastPasswordChange(LocalDateTime.now());
            String customTeacherId = String.format("FE-TEACH-%d-%04d", LocalDate.now().getYear(), savedTeacher.getTeacherId());
            savedTeacher.setCustomTeacherId(customTeacherId);
            teacherRepo.save(savedTeacher);

            return new AuthResponse(jwtService.generateToken(savedTeacher), "TEACHER");
        } else {
            Student student = Student.builder()
                    .email(req.getEmail())
                    .first_name(req.getFirst_name())
                    .last_name(req.getLast_name())
                    .password(encodedPassword)
                    .date_Of_birth(req.getDate_of_birth())
                    .role(Role.STUDENT)
                    .build();

            Student savedStudent = studentRepo.save(student);
            savedStudent.setLastPasswordChange(LocalDateTime.now());
            String customId = String.format("FE-STUD-%d-%04d", LocalDate.now().getYear(), savedStudent.getStudentId());
            savedStudent.setCustomStudentId(customId);
            studentRepo.save(savedStudent);

            return new AuthResponse(jwtService.generateToken(savedStudent), "STUDENT");
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

        String role = user.getRole().name();
        return new AuthResponse(jwtService.generateToken(user), role);
    }

    @Transactional
    public UserDetailsResponse getUserDetails(String email) {
        Optional<? extends User> userOpt =
                teacherRepo.findByEmail(email).map(u -> (User) u)
                        .or(() -> studentRepo.findByEmail(email).map(u -> (User) u));

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserDetailsResponse response = new UserDetailsResponse();
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        if (user instanceof Student student) {
            response.setFirstName(student.getFirst_name());
            response.setLastName(student.getLast_name());
            response.setDate_Of_birth(student.getDate_Of_birth());
            response.setProfilePictureUrl(student.getProfilePictureUrl());
            response.setCustomStudentId(student.getCustomStudentId());
            response.setLastPasswordChange(student.getLastPasswordChange());

        } else if (user instanceof Teacher teacher) {
            response.setFirstName(teacher.getFirst_name());
            response.setLastName(teacher.getLast_name());
            response.setSchool(teacher.getSchool());
            response.setProfilePictureUrl(teacher.getProfilePictureUrl());
            response.setCustomTeacherId(teacher.getCustomTeacherId());
            response.setLastPasswordChange(teacher.getLastPasswordChange());
        }

        return response;
    }

    public UserDetailsResponse updateProfile(String email, String firstName, String lastName, String school, String profilePictureUrl) {
        Optional<? extends User> userOpt = teacherRepo.findByEmail(email).map(u -> (User) u)
                .or(() -> studentRepo.findByEmail(email).map(u -> (User) u));

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user instanceof Teacher teacher) {
            if (firstName != null) teacher.setFirst_name(firstName);
            if (lastName != null) teacher.setLast_name(lastName);
            if (school != null) teacher.setSchool(school);
            if (profilePictureUrl != null) teacher.setProfilePictureUrl(profilePictureUrl);
            teacherRepo.save(teacher);
        } else if (user instanceof Student student) {
            if (firstName != null) student.setFirst_name(firstName);
            if (lastName != null) student.setLast_name(lastName);
            if (profilePictureUrl != null) student.setProfilePictureUrl(profilePictureUrl);
            studentRepo.save(student);
        }

        return getUserDetails(email);
    }

    public String logout(String token) {
        return "Logout successful.";
    }

    public boolean changePassword(String email, String currentPassword, String newPassword) {
        Optional<Teacher> teacherOpt = teacherRepo.findByEmail(email);
        if (teacherOpt.isPresent()) {
            Teacher teacher = teacherOpt.get();
            if (passwordEncoder.matches(currentPassword, teacher.getPassword())) {
                teacher.setPassword(passwordEncoder.encode(newPassword));
                teacher.setLastPasswordChange(LocalDateTime.now());
                teacherRepo.save(teacher);
                return true;
            }
            return false;
        }

        Optional<Student> studentOpt = studentRepo.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (passwordEncoder.matches(currentPassword, student.getPassword())) {
                student.setPassword(passwordEncoder.encode(newPassword));
                student.setLastPasswordChange(LocalDateTime.now());
                studentRepo.save(student);
                return true;
            }
            return false;
        }

        throw new UsernameNotFoundException("User not found");
    }
}
