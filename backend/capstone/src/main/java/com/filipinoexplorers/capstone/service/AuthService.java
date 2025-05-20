package com.filipinoexplorers.capstone.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.filipinoexplorers.capstone.dto.*;
import com.filipinoexplorers.capstone.entity.*;
import com.filipinoexplorers.capstone.repository.*;

@Service
public class AuthService {

    @Autowired private TeacherRepository teacherRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    // Register method updated to handle teacher or student role
    public AuthResponse register(RegisterRequest req, MultipartFile profilePicture) {
        String encodedPassword = passwordEncoder.encode(req.getPassword());
        byte[] profilePictureBytes = null;

        // Handle profile picture if present
        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                profilePictureBytes = profilePicture.getBytes();
            } catch (IOException e) {
                throw new RuntimeException("Failed to read profile picture bytes", e);
            }
        }

        // Register teacher or student based on the role
        if ("TEACHER".equalsIgnoreCase(req.getRole())) {
            Teacher teacher = Teacher.builder()
                    .email(req.getEmail())
                    .first_name(req.getFirst_name())
                    .last_name(req.getLast_name())
                    .password(encodedPassword)
                    .school(req.getSchool())
                    .role(Role.TEACHER)
                    .profilePictureData(profilePictureBytes)
                    .build();
            teacherRepo.save(teacher);
            return new AuthResponse(jwtService.generateToken(teacher), "TEACHER");
        } else {
            Student student = Student.builder()
                    .email(req.getEmail())
                    .first_name(req.getFirst_name())
                    .last_name(req.getLast_name())
                    .password(encodedPassword)
                    .date_Of_birth(req.getDate_of_birth())
                    .role(Role.STUDENT)
                    .profilePictureData(profilePictureBytes)
                    .build();
            studentRepo.save(student);
            return new AuthResponse(jwtService.generateToken(student), "STUDENT");
        }
    }

    // Login method modified to return role along with token
    public AuthResponse login(LoginRequest req) {
        Optional<? extends User> userOpt =
                teacherRepo.findByEmail(req.getEmail()).map(u -> (User) u)
                .or(() -> studentRepo.findByEmail(req.getEmail()).map(u -> (User) u));

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Check if password matches
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        // Get the role of the user
        String role = user.getRole().name();  // Assuming Role is an enum with TEACHER and STUDENT

        // Return token and role in the response
        return new AuthResponse(jwtService.generateToken(user), role);
    }

    // Get user details, including role, to send back in the response
    public UserDetailsResponse getUserDetails(String email) {
        Optional<? extends User> userOpt =
                teacherRepo.findByEmail(email).map(u -> (User) u)
                .or(() -> studentRepo.findByEmail(email).map(u -> (User) u));

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserDetailsResponse response = new UserDetailsResponse();
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());  // Set the role

        // Set user-specific details based on the type of user (Teacher or Student)
        if (user instanceof Student student) {
            response.setFirstName(student.getFirst_name());
            response.setLastName(student.getLast_name());
            response.setDate_Of_birth(student.getDate_Of_birth());
            response.setHasProfilePicture(student.getProfilePictureData() != null);
        } else if (user instanceof Teacher teacher) {
            response.setFirstName(teacher.getFirst_name());
            response.setLastName(teacher.getLast_name());
            response.setSchool(teacher.getSchool());
            response.setHasProfilePicture(teacher.getProfilePictureData() != null);
        }

        return response;
    }

    // Update profile, can handle both Teacher and Student updates
    public UserDetailsResponse updateProfile(String email, String firstName, String lastName, String school, LocalDate date_Of_birth, MultipartFile profilePicture) {
        Optional<? extends User> userOpt =
                teacherRepo.findByEmail(email).map(u -> (User) u)
                .or(() -> studentRepo.findByEmail(email).map(u -> (User) u));

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        byte[] profilePictureBytes = null;
        // Handle profile picture update
        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                profilePictureBytes = profilePicture.getBytes();
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile picture", e);
            }
        }

        // Update Teacher or Student data based on the type of user
        if (user instanceof Teacher teacher) {
            if (firstName != null) teacher.setFirst_name(firstName);
            if (lastName != null) teacher.setLast_name(lastName);
            if (school != null) teacher.setSchool(school);
            if (profilePictureBytes != null) teacher.setProfilePictureData(profilePictureBytes);
            teacherRepo.save(teacher);

        } else if (user instanceof Student student) {
            if (firstName != null) student.setFirst_name(firstName);
            if (lastName != null) student.setLast_name(lastName);
            if (date_Of_birth != null) student.setDate_Of_birth(date_Of_birth);
            if (profilePictureBytes != null) student.setProfilePictureData(profilePictureBytes);
            studentRepo.save(student);
        }

        return getUserDetails(email);  // Return updated user details
    }

    public String logout(String token) {
        System.out.println("Logging out token: " + token);
        return "Logout successful.";
    }

    public boolean changePassword(String email, String currentPassword, String newPassword) {
        Optional<Teacher> teacherOpt = teacherRepo.findByEmail(email);
        if (teacherOpt.isPresent()) {
            Teacher teacher = teacherOpt.get();
            if (passwordEncoder.matches(currentPassword, teacher.getPassword())) {
                teacher.setPassword(passwordEncoder.encode(newPassword));
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
                studentRepo.save(student);
                return true;
            }
            return false;
        }

        throw new UsernameNotFoundException("User not found");
    }
    
}
