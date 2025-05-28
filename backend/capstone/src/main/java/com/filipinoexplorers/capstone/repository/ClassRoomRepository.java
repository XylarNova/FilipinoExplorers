package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.ClassRoom;
import com.filipinoexplorers.capstone.entity.Teacher;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    List<ClassRoom> findByTeacher_TeacherId(Long teacherId);
    List<ClassRoom> findByTeacher(Teacher teacher);
    boolean existsByClassCode(String classCode); 
    Optional<ClassRoom> findByClassCode(String classCode);
    int countByTeacher(Teacher teacher);

}
