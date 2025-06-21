package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.GroupGameSession;
import com.filipinoexplorers.capstone.entity.Student;
import com.filipinoexplorers.capstone.repository.GroupGameSessionRepository;
import com.filipinoexplorers.capstone.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupGameSessionService {

    private final GroupGameSessionRepository sessionRepository;
    private final StudentRepository studentRepository;

    public GroupGameSession createSession(GroupGameSession session) {
        return sessionRepository.save(session);
    }

    public List<GroupGameSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    public List<GroupGameSession> getSessionsByStudentId(Long studentId) {
        return sessionRepository.findByParticipants_StudentId(studentId);
    }

    public List<GroupGameSession> getSessionsByTeacherId(Long teacherId) {
        return sessionRepository.findByCreatedByTeacherId(teacherId);
    }

    public GroupGameSession joinSession(Long sessionId, Long studentId) {
        GroupGameSession session = sessionRepository.findById(sessionId).orElse(null);
        Student student = studentRepository.findById(studentId).orElse(null);

        if (session != null && student != null) {
            session.getParticipants().add(student);
            return sessionRepository.save(session);
        }
        return null;
    }
}
