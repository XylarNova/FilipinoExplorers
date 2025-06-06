package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.StudentGameSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentGameSessionRepository extends JpaRepository<StudentGameSession, Long> {
    List<StudentGameSession> findByGameBank_Classrooms_Id(Long classroomId);
}
