package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.GroupGameStudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupGameStudentProgressRepository extends JpaRepository<GroupGameStudentProgress, Long> {
    List<GroupGameStudentProgress> findByGroupGameSession_Id(Long sessionId);
    List<GroupGameStudentProgress> findByStudent_StudentId(Long studentId);
    Optional<GroupGameStudentProgress> findByStudent_StudentIdAndGroupGameSession_Id(Long studentId, Long sessionId);
}
