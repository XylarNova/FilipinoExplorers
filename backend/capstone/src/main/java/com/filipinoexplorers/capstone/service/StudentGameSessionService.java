package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.StudentGameSession;
import com.filipinoexplorers.capstone.repository.StudentGameSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentGameSessionService {

    private final StudentGameSessionRepository sessionRepo;

    public List<StudentGameSession> getProgressByClassroom(Long classroomId) {
        return sessionRepo.findByGameBank_Classrooms_Id(classroomId);
    }

    public StudentGameSession save(StudentGameSession session) {
        return sessionRepo.save(session);
    }
}
