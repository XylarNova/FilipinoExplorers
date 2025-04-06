package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.StudentEntity;
import com.filipinoexplorers.capstone.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

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

    // Create a new student
    public StudentEntity createStudent(StudentEntity student) {
        // Check if the email already exists
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("A student with this email already exists.");
        }
        student.setPassword(hashPassword(student.getPassword())); // Hash the password before saving
        return studentRepository.save(student);
    }

    // Login a student
    public StudentEntity loginStudent(String email, String password) {
        StudentEntity student = studentRepository.findByEmail(email);
        if (student == null || !student.getPassword().equals(hashPassword(password))) {
            throw new RuntimeException("Invalid email or password");
        }
        return student;
    }

    // Get all students
    public List<StudentEntity> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get a student by ID
    public Optional<StudentEntity> getStudentById(Long studentId) {
        return studentRepository.findById(studentId);
    }

    // Update a student
    public StudentEntity updateStudent(Long studentId, StudentEntity updatedStudent) {
        Optional<StudentEntity> existingStudentOpt = studentRepository.findById(studentId);
        if (existingStudentOpt.isPresent()) {
            StudentEntity existingStudent = existingStudentOpt.get();
            existingStudent.setFirstname(updatedStudent.getFirstname());
            existingStudent.setLastname(updatedStudent.getLastname());
            existingStudent.setBirthdate(updatedStudent.getBirthdate());
            existingStudent.setEmail(updatedStudent.getEmail());
            if (updatedStudent.getPassword() != null && !updatedStudent.getPassword().isEmpty()) {
                existingStudent.setPassword(hashPassword(updatedStudent.getPassword())); // Hash the new password
            }
            return studentRepository.save(existingStudent);
        } else {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
    }

    // Delete a student by ID
    public void deleteStudent(Long studentId) {
        if (studentRepository.existsById(studentId)) {
            studentRepository.deleteById(studentId);
        } else {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
    }
}