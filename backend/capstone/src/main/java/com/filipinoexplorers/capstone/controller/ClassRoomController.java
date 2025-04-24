package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.dto.ClassCreationRequest;
import com.filipinoexplorers.capstone.entity.ClassRoom;
import com.filipinoexplorers.capstone.entity.Teacher;
import com.filipinoexplorers.capstone.repository.ClassRoomRepository;
import com.filipinoexplorers.capstone.repository.TeacherRepository;
import com.filipinoexplorers.capstone.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClassRoomController {

    @Autowired
    private ClassRoomRepository classRoomRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private JwtService jwtService; // Inject JwtService to extract the email from token

    // Create a class
    @PostMapping("/createclass")
    public ResponseEntity<?> createClass(@RequestHeader("Authorization") String token,
                                         @RequestPart("info") ClassCreationRequest request,
                                         @RequestPart(value = "banner", required = false) MultipartFile banner) throws IOException {

        // Extract the email from the JWT token
        String email = jwtService.extractUsername(token.replace("Bearer ", ""));

        // Find teacher by email
        Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found");
        }

        // Generate unique class code
        String classCode = generateClassCode();

        // Create class entity
        ClassRoom classRoom = new ClassRoom();
        classRoom.setName(request.getName());
        classRoom.setDescription(request.getDescription());
        classRoom.setEnrollmentMethod(request.getEnrollmentMethod());
        classRoom.setTeacher(teacherOpt.get());
        classRoom.setClassCode(classCode);

        // Handle optional banner
        if (banner != null && !banner.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + banner.getOriginalFilename();
            Path path = Paths.get("uploads/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, banner.getBytes());
            classRoom.setBannerUrl("/uploads/" + fileName);
        }

        // Save and return the class
        return ResponseEntity.ok(classRoomRepository.save(classRoom));
    }

    // Get all classes for a specific teacher by email
    @GetMapping("/teacher/email/{email}")
    public ResponseEntity<List<ClassRoom>> getClassesByTeacherEmail(@PathVariable String email) {
        // Find teacher by email
        Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        // Retrieve classes for the teacher
        List<ClassRoom> classes = classRoomRepository.findByTeacher(teacherOpt.get());
        return ResponseEntity.ok(classes);
    }

    // Helper to generate unique class codes
    private String generateClassCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 8);
        } while (classRoomRepository.existsByClassCode(code));
        return code;
    }

    // Update class info
@PutMapping("/update/{id}")
public ResponseEntity<?> updateClass(@PathVariable Long id,
                                     @RequestBody ClassCreationRequest request,
                                     @RequestHeader("Authorization") String token) {

    // Extract teacher from token to ensure ownership (optional security check)
    String email = jwtService.extractUsername(token.replace("Bearer ", ""));
    Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
    if (teacherOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }

    Optional<ClassRoom> existingClassOpt = classRoomRepository.findById(id);
    if (existingClassOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
    }

    ClassRoom classRoom = existingClassOpt.get();

    // (Optional security) Verify that the current teacher owns the class
    if (!classRoom.getTeacher().getEmail().equals(email)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to update this class.");
    }

    // Update class fields
    classRoom.setName(request.getName());
    classRoom.setDescription(request.getDescription());
    classRoom.setBannerUrl(request.getBannerUrl()); // Add banner URL if needed

    return ResponseEntity.ok(classRoomRepository.save(classRoom));
}

// Delete a class
@DeleteMapping("/delete/{id}")
public ResponseEntity<?> deleteClass(@PathVariable Long id, @RequestHeader("Authorization") String token) {
    // Extract teacher from token to ensure ownership (optional security check)
    String email = jwtService.extractUsername(token.replace("Bearer ", ""));
    Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
    if (teacherOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }

    Optional<ClassRoom> classRoomOpt = classRoomRepository.findById(id);
    if (classRoomOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
    }

    ClassRoom classRoom = classRoomOpt.get();

    // (Optional security) Verify that the current teacher owns the class
    if (!classRoom.getTeacher().getEmail().equals(email)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to delete this class.");
    }

    // Delete the class
    classRoomRepository.delete(classRoom);

    return ResponseEntity.ok("Class deleted successfully");
}


}
