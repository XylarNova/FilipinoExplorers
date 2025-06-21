package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.GroupGameSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupGameSessionRepository extends JpaRepository<GroupGameSession, Long> {
    List<GroupGameSession> findByParticipants_StudentId(Long studentId);
    List<GroupGameSession> findByCreatedByTeacherId(Long teacherId);
}
