package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.StudentGameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import com.filipinoexplorers.capstone.entity.StudentGameSession.GameStatus;

import java.util.List;

public interface StudentGameSessionRepository extends JpaRepository<StudentGameSession, Long> {
    List<StudentGameSession> findByGameBank_Classrooms_Id(Long classroomId);
    List<StudentGameSession> findByStudent_StudentIdAndStatus(Long studentId, GameStatus status);
}
