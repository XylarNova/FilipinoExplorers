package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.dto.ClassCreationRequest;
import com.filipinoexplorers.capstone.entity.ClassRoom;
import com.filipinoexplorers.capstone.entity.Student;
import com.filipinoexplorers.capstone.entity.Teacher;
import com.filipinoexplorers.capstone.repository.ClassRoomRepository;
import com.filipinoexplorers.capstone.repository.StudentRepository;
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
    private StudentRepository studentRepository;

    @Autowired
    private JwtService jwtService;

    // Create a class
    @PostMapping("/createclass")
    public ResponseEntity<?> createClass(@RequestHeader("Authorization") String token,
                                         @RequestPart("info") ClassCreationRequest request,
                                         @RequestPart(value = "banner", required = false) MultipartFile banner) throws IOException {

        String email = jwtService.extractUsername(token.replace("Bearer ", ""));
        Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found");
        }

        String classCode = generateClassCode();

        ClassRoom classRoom = new ClassRoom();
        classRoom.setName(request.getName());
        classRoom.setDescription(request.getDescription());
        classRoom.setEnrollmentMethod(request.getEnrollmentMethod());
        classRoom.setTeacher(teacherOpt.get());
        classRoom.setClassCode(classCode);

        if (banner != null && !banner.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + banner.getOriginalFilename();
            Path path = Paths.get("uploads/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, banner.getBytes());
            classRoom.setBannerUrl("/uploads/" + fileName);
        } else if (request.getBannerUrl() != null && !request.getBannerUrl().isEmpty()) {
            // Set bannerUrl from request if no banner file uploaded
            classRoom.setBannerUrl("/assets/images/ClassroomBanner/" + request.getBannerUrl());
        }

        return ResponseEntity.ok(classRoomRepository.save(classRoom));
    }

    // Get classes for teacher
    @GetMapping("/teacher/email/{email}")
    public ResponseEntity<List<ClassRoom>> getClassesByTeacherEmail(@PathVariable String email) {
        Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        List<ClassRoom> classes = classRoomRepository.findByTeacher(teacherOpt.get());
        return ResponseEntity.ok(classes);
    }

    // Student joins class
  @PostMapping("/join")
    public ResponseEntity<?> joinClass(@RequestHeader("Authorization") String token,
                                    @RequestBody Map<String, String> payload) {

        String email = jwtService.extractUsername(token.replace("Bearer ", ""));
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }

        String classCode = payload.get("classCode");
        Optional<ClassRoom> classRoomOpt = classRoomRepository.findByClassCode(classCode);
        if (classRoomOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
        }

        Student student = studentOpt.get();
        ClassRoom classRoom = classRoomOpt.get();

        // Check if student already joined any class
        if (!student.getClassrooms().isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("You have already enrolled in a class");
        }

        if (student.getClassrooms().contains(classRoom)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Student already joined this class");
        }

        student.getClassrooms().add(classRoom);
        classRoom.getStudents().add(student);
        studentRepository.save(student);
        classRoomRepository.save(classRoom);

        // ✅ Return success message with classRoomId
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Student successfully joined the class!");
        response.put("classRoomId", classRoom.getId());

        return ResponseEntity.ok(response);
    }


    // Generate unique code
    private String generateClassCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 8);
        } while (classRoomRepository.existsByClassCode(code));
        return code;
    }

    // Update class
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateClass(@PathVariable Long id,
                                         @RequestBody ClassCreationRequest request,
                                         @RequestHeader("Authorization") String token) {

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

        if (!classRoom.getTeacher().getEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to update this class.");
        }

        classRoom.setName(request.getName());
        classRoom.setDescription(request.getDescription());
        classRoom.setBannerUrl(request.getBannerUrl());

        return ResponseEntity.ok(classRoomRepository.save(classRoom));
    }

    // Delete class
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable Long id, @RequestHeader("Authorization") String token) {
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

        if (!classRoom.getTeacher().getEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to delete this class.");
        }

        classRoomRepository.delete(classRoom);

        return ResponseEntity.ok("Class deleted successfully");
    }

    // Student joined classes
    @GetMapping("/student/joined")
    public ResponseEntity<?> getJoinedClasses(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractUsername(token.replace("Bearer ", ""));
            Optional<Student> studentOpt = studentRepository.findByEmail(email);

            if (studentOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
            }

            Student student = studentOpt.get();
            return ResponseEntity.ok(student.getClassrooms());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }

    // Search students
    @GetMapping("/search-students")
    public ResponseEntity<?> searchStudentsByEmail(@RequestParam String query,
                                                   @RequestHeader("Authorization") String token) {
        String teacherEmail = jwtService.extractUsername(token.replace("Bearer ", ""));
        Optional<Teacher> teacherOpt = teacherRepository.findByEmail(teacherEmail);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        List<Student> matchedStudents = studentRepository.findByEmailContainingIgnoreCase(query);
        return ResponseEntity.ok(matchedStudents);
    }

    // Teacher adds student
    @PostMapping("/add-student")
public ResponseEntity<?> addStudentToClass(
        @RequestHeader("Authorization") String token,
        @RequestBody Map<String, String> payload) {

    String teacherEmail = jwtService.extractUsername(token.replace("Bearer ", ""));
    Optional<Teacher> teacherOpt = teacherRepository.findByEmail(teacherEmail);
    if (teacherOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }

    String studentEmail = payload.get("studentEmail");
    String classCode = payload.get("classCode");

    if (studentEmail == null || classCode == null) {
        return ResponseEntity.badRequest().body("Missing studentEmail or classCode");
    }

    Optional<Student> studentOpt = studentRepository.findByEmail(studentEmail);
    if (studentOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
    }

    Optional<ClassRoom> classRoomOpt = classRoomRepository.findByClassCode(classCode);
    if (classRoomOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
    }

    ClassRoom classRoom = classRoomOpt.get();
    if (!classRoom.getTeacher().getEmail().equals(teacherEmail)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not own this class");
    }

    Student student = studentOpt.get();

    if (student.getClassrooms().contains(classRoom)) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Student already in class");
    }

    student.getClassrooms().add(classRoom);
    classRoom.getStudents().add(student);
    studentRepository.save(student);
    classRoomRepository.save(classRoom);

    return ResponseEntity.ok(Collections.singletonMap("message", "Student added to class successfully"));
}

// Count number of classes for the logged-in teacher
@GetMapping("/count-by-teacher")
public ResponseEntity<?> countClassesForTeacher(@RequestHeader("Authorization") String token) {
    try {
        String email = jwtService.extractUsername(token.replace("Bearer ", ""));
        Optional<Teacher> teacherOpt = teacherRepository.findByEmail(email);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Teacher teacher = teacherOpt.get();
        int count = classRoomRepository.countByTeacher(teacher);
        return ResponseEntity.ok(count);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to count classes.");
    }
}


}