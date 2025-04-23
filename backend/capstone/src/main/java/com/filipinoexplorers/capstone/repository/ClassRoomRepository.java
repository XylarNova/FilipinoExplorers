package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    List<ClassRoom> findByTeacher_TeacherId(Long teacherId);
    
    boolean existsByClassCode(String classCode); 
}
