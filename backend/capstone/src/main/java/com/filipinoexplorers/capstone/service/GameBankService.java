package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.dto.GameBankRequestDTO;
import com.filipinoexplorers.capstone.entity.ClassRoom;
import com.filipinoexplorers.capstone.entity.GameBank;
import com.filipinoexplorers.capstone.entity.MGQuestion;
import com.filipinoexplorers.capstone.repository.ClassRoomRepository;
import com.filipinoexplorers.capstone.repository.GameBankRepository;
import com.filipinoexplorers.capstone.repository.MGQuestionRepository;
import com.filipinoexplorers.capstone.repository.TeacherRepository;
import com.filipinoexplorers.capstone.dto.QuestionRequestDTO;
import com.filipinoexplorers.capstone.dto.UpdateGameBankRequestDTO;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameBankService {

    private final GameBankRepository gameSessionRepository;
    private final ClassRoomRepository classRoomRepository;
    private final MGQuestionRepository questionRepository;
    private final TeacherRepository teacherRepository;

    public List<GameBank> getAllGameSessions() {
        return gameSessionRepository.findAll();
    }

    public GameBank saveGameSession(GameBank gameSession) {
        return gameSessionRepository.save(gameSession);
    }

    public Optional<GameBank> getGameSessionById(Long id) {
        return gameSessionRepository.findById(id);
    }

    public GameBank createGameSession(GameBank gameSession) {
        return gameSessionRepository.save(gameSession);
    }

    // ✅ Create with assigned teacher
    public GameBank createGameSessionFromDTO(GameBankRequestDTO request) {
        // ✅ Load classrooms if provided
        List<ClassRoom> classrooms = null;
        if (request.getClassRoomIds() != null && !request.getClassRoomIds().isEmpty()) {
            classrooms = classRoomRepository.findAllById(request.getClassRoomIds());
            if (classrooms.size() != request.getClassRoomIds().size()) {
                throw new RuntimeException("One or more ClassRooms not found");
            }
        }

        // ✅ Load teacher
        com.filipinoexplorers.capstone.entity.Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
        }

        // ✅ Convert vocabulary questions from DTOs
        List<MGQuestion> questions = Collections.emptyList();
        if (request.getVocabularyQuestions() != null && !request.getVocabularyQuestions().isEmpty()) {
            questions = request.getVocabularyQuestions().stream()
                    .map(dto -> MGQuestion.builder()
                            .tagalogWord(dto.getTagalogWord())
                            .choices(dto.getChoices())
                            .correctAnswer(dto.getCorrectAnswer())
                            .hint(dto.getHint())
                            .build())
                    .toList();

            questions = questionRepository.saveAll(questions); // ✅ Persist to DB
        }

        // ✅ Build the GameBank
        GameBank.GameBankBuilder gameBuilder = GameBank.builder()
                .gameTitle(request.getGameTitle())
                .category(request.getCategory())
                .leaderboard(request.isLeaderboard())
                .hints(request.isHints())
                .review(request.isReview())
                .shuffle(request.isShuffle())
                .windowTracking(request.isWindowTracking())
                .setTime(request.getSetTime())
                .quarter(request.getQuarter())
                .gamePoints(request.getGamePoints())
                .status(request.getStatus())
                .vocabularyQuestions(questions);

        if (classrooms != null) gameBuilder.classrooms(classrooms);
        if (teacher != null) gameBuilder.teacher(teacher);

        GameBank game = gameBuilder.build();
        return gameSessionRepository.save(game);
    }

        public GameBank updateGameSessionFromDTO(Long id, UpdateGameBankRequestDTO request) {
    GameBank existing = gameSessionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("GameSession not found"));

    // Basic fields
    existing.setGameTitle(request.getGameTitle());
    existing.setCategory(request.getCategory());
    existing.setLeaderboard(request.isLeaderboard());
    existing.setHints(request.isHints());
    existing.setReview(request.isReview());
    existing.setShuffle(request.isShuffle());
    existing.setWindowTracking(request.isWindowTracking());
    existing.setSetTime(request.getSetTime());
    existing.setQuarter(request.getQuarter());
    existing.setGamePoints(request.getGamePoints());
    existing.setStatus(request.getStatus());
    existing.setLastModified(LocalDateTime.now());

    // ✅ Handle classrooms
    if (request.getClassRoomIds() != null) {
        List<ClassRoom> newClassrooms = classRoomRepository.findAllById(request.getClassRoomIds());
        existing.getClassrooms().clear();
        existing.getClassrooms().addAll(newClassrooms);
    }

    // ✅ Handle vocabulary questions
    List<MGQuestion> updatedQuestions = request.getVocabularyQuestions().stream().map(dto -> {
        if (dto.getId() != null) {
            // Updating existing question
            return questionRepository.findById(dto.getId()).map(existingQ -> {
                existingQ.setTagalogWord(dto.getTagalogWord());
                existingQ.setChoices(dto.getChoices());
                existingQ.setCorrectAnswer(dto.getCorrectAnswer());
                existingQ.setHint(dto.getHint());
                return existingQ;
            }).orElseThrow(() -> new RuntimeException("Question not found: " + dto.getId()));
        } else {
            // Creating new question
            return MGQuestion.builder()
                    .tagalogWord(dto.getTagalogWord())
                    .choices(dto.getChoices())
                    .correctAnswer(dto.getCorrectAnswer())
                    .hint(dto.getHint())
                    .build();
        }
    }).collect(Collectors.toList());

    updatedQuestions = questionRepository.saveAll(updatedQuestions);

    // Clear and replace only the managed list
    existing.getVocabularyQuestions().clear();
    existing.getVocabularyQuestions().addAll(updatedQuestions);

    return gameSessionRepository.save(existing);
}


    public GameBank updateGameSession(Long id, GameBank updatedSession) {
        return gameSessionRepository.findById(id)
            .map(existing -> {
                existing.setGameTitle(updatedSession.getGameTitle());
                existing.setCategory(updatedSession.getCategory());
                existing.setLeaderboard(updatedSession.isLeaderboard());
                existing.setHints(updatedSession.isHints());
                existing.setReview(updatedSession.isReview());
                existing.setShuffle(updatedSession.isShuffle());
                existing.setWindowTracking(updatedSession.isWindowTracking());
                existing.setSetTime(updatedSession.getSetTime());
                existing.setQuarter(updatedSession.getQuarter());
                existing.setGamePoints(updatedSession.getGamePoints());
                existing.setVocabularyQuestions(updatedSession.getVocabularyQuestions()); // update vocabularyQuestions
                existing.setStatus(updatedSession.getStatus());
                existing.setClassrooms(updatedSession.getClassrooms());
                return gameSessionRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("GameSession not found"));
    }

    public void deleteGameSession(Long id) {
        gameSessionRepository.deleteById(id);
    }

    public List<GameBank> getByCategory(String category) {
        return gameSessionRepository.findByCategory(category);
    }

    public List<GameBank> getByQuarter(String quarter) {
        return gameSessionRepository.findByQuarter(quarter);
    }

    public List<GameBank> getByReview(boolean review) {
        return gameSessionRepository.findByReview(review);
    }

    public List<GameBank> getByLeaderboard(boolean leaderboard) {
        return gameSessionRepository.findByLeaderboard(leaderboard);
    }

    public List<GameBank> getByHints(boolean hints) {
        return gameSessionRepository.findByHints(hints);
    }

    public List<GameBank> getByCategoryAndQuarterAndReview(String category, String quarter, boolean review) {
        return gameSessionRepository.findByCategoryAndQuarterAndReview(category, quarter, review);
    }

    public List<GameBank> getByCategoryAndQuarter(String category, String quarter) {
        return gameSessionRepository.findByCategoryAndQuarter(category, quarter);
    }

    public List<GameBank> getByCategoryAndReview(String category, boolean review) {
        return gameSessionRepository.findByCategoryAndReview(category, review);
    }

    public List<GameBank> getByQuarterAndReview(String quarter, boolean review) {
        return gameSessionRepository.findByQuarterAndReview(quarter, review);
    }

    public List<GameBank> getByStatus(String status) {
        return gameSessionRepository.findByStatus(status);
    }

    public List<GameBank> getByClassrooms_Id(Long classRoomId) {
        return gameSessionRepository.findByClassrooms_Id(classRoomId);
    }

    public List<GameBank> getOpenVocabularyGames() {
        return gameSessionRepository.findByStatusAndCategory("Open", "Vocabulary");
    }

   public List<MGQuestion> getVocabularyQuestionsByGameSessionId(Long id) {
    return gameSessionRepository.findById(id)
            .map(GameBank::getVocabularyQuestions) // ✅ correct getter
            .orElse(Collections.emptyList());
}

    public void updateClassRoom(GameBank session, Long classRoomId) {
        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new RuntimeException("ClassRoom not found"));
        session.setClassrooms(List.of(classRoom));
        session.setLastModified(java.time.LocalDateTime.now());
        gameSessionRepository.save(session);
    }

    // ✅ Filter games visible to teacher: created by them OR created by DEV (null teacher)
    public List<GameBank> getGamesVisibleToTeacher(Long teacherId) {
        return gameSessionRepository.findAll().stream()
                .filter(g -> g.getTeacher() == null || (g.getTeacher() != null && g.getTeacher().getTeacherId().equals(teacherId)))
                .toList();
    }

    public List<GameBank> getGamesByTeacher(com.filipinoexplorers.capstone.entity.Teacher teacher) {
    return gameSessionRepository.findByTeacher(teacher);
}

    public List<MGQuestion> getQuestionsByIds(List<Long> questionIds) {
            return questionRepository.findAllById(questionIds);
        }


}
