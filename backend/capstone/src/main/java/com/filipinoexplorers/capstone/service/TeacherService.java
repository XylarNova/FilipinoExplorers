package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.TeacherEntity;
import com.filipinoexplorers.capstone.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    // Method to hash the password using SHA-256
    public String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    // Create a new teacher
    public TeacherEntity createTeacher(TeacherEntity teacher) {
        // Check if the email already exists
        if (teacherRepository.existsByEmail(teacher.getEmail())) {
            throw new RuntimeException("A teacher with this email already exists.");
        }
        teacher.setPassword(hashPassword(teacher.getPassword())); // Hash the password before saving
        return teacherRepository.save(teacher);
    }

    // Login a teacher
    public TeacherEntity loginTeacher(String email, String password) {
        TeacherEntity teacher = teacherRepository.findByEmail(email);
        if (teacher == null || !teacher.getPassword().equals(hashPassword(password))) {
            throw new RuntimeException("Invalid email or password");
        }
        return teacher;
    }

    // Get all teachers
    public List<TeacherEntity> getAllTeachers() {
        return teacherRepository.findAll();
    }

    // Get a teacher by ID
    public Optional<TeacherEntity> getTeacherById(Long teacherId) {
        return teacherRepository.findById(teacherId);
    }

    // Update a teacher
    public TeacherEntity updateTeacher(Long teacherId, TeacherEntity updatedTeacher) {
        Optional<TeacherEntity> existingTeacherOpt = teacherRepository.findById(teacherId);
        if (existingTeacherOpt.isPresent()) {
            TeacherEntity existingTeacher = existingTeacherOpt.get();
            existingTeacher.setFirstname(updatedTeacher.getFirstname());
            existingTeacher.setLastname(updatedTeacher.getLastname());
            existingTeacher.setEmail(updatedTeacher.getEmail());
            existingTeacher.setInstitution(updatedTeacher.getInstitution());
            if (updatedTeacher.getPassword() != null && !updatedTeacher.getPassword().isEmpty()) {
                existingTeacher.setPassword(hashPassword(updatedTeacher.getPassword())); // Hash the new password
            }
            return teacherRepository.save(existingTeacher);
        } else {
            throw new RuntimeException("Teacher not found with ID: " + teacherId);
        }
    }

    // Delete a teacher by ID
    public void deleteTeacher(Long teacherId) {
        if (teacherRepository.existsById(teacherId)) {
            teacherRepository.deleteById(teacherId);
        } else {
            throw new RuntimeException("Teacher not found with ID: " + teacherId);
        }
    }
}