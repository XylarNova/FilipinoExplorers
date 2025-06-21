package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.GroupGameSession;
import com.filipinoexplorers.capstone.entity.GroupGameStudentProgress;
import com.filipinoexplorers.capstone.entity.Student;
import com.filipinoexplorers.capstone.repository.GroupGameSessionRepository;
import com.filipinoexplorers.capstone.repository.GroupGameStudentProgressRepository;
import com.filipinoexplorers.capstone.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupGameStudentProgressService {

    private final GroupGameStudentProgressRepository progressRepository;
    private final StudentRepository studentRepository;
    private final GroupGameSessionRepository sessionRepository;

    public GroupGameStudentProgress recordProgress(Long studentId, Long sessionId, int correctAnswers, int totalAnswered, long timeSpent, String status) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        GroupGameSession session = sessionRepository.findById(sessionId).orElseThrow();

        return progressRepository.findByStudent_StudentIdAndGroupGameSession_Id(studentId, sessionId)
                .map(progress -> {
                    progress.setCorrectAnswers(correctAnswers);
                    progress.setTotalQuestionsAnswered(totalAnswered);
                    progress.setTimeSpentInSeconds(timeSpent);
                    progress.setStatus(status);
                    return progressRepository.save(progress);
                })
                .orElseGet(() -> progressRepository.save(
                        GroupGameStudentProgress.builder()
                            .student(student)
                            .groupGameSession(session)
                            .correctAnswers(correctAnswers)
                            .totalQuestionsAnswered(totalAnswered)
                            .timeSpentInSeconds(timeSpent)
                            .status(status)
                            .build()
                ));
    }

    public List<GroupGameStudentProgress> getProgressForStudent(Long studentId) {
        return progressRepository.findByStudent_StudentId(studentId);
    }

    public List<GroupGameStudentProgress> getProgressForSession(Long sessionId) {
        return progressRepository.findByGroupGameSession_Id(sessionId);
    }
}
