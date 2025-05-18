package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.ClassRoom;
import com.filipinoexplorers.capstone.entity.GameBank;
import com.filipinoexplorers.capstone.entity.Question;
import com.filipinoexplorers.capstone.repository.ClassRoomRepository;
import com.filipinoexplorers.capstone.repository.GameBankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameBankService {

    private final GameBankRepository gameSessionRepository;
    private final ClassRoomRepository classRoomRepository;

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
                existing.setQuestions(updatedSession.getQuestions());
                existing.setStatus(updatedSession.getStatus());
                existing.setClassRoom(updatedSession.getClassRoom());
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

    public List<GameBank> getByClassRoomId(Long classRoomId) {
        return gameSessionRepository.findByClassRoom_Id(classRoomId);
    }

    public List<GameBank> getOpenVocabularyGames() {
        return gameSessionRepository.findByStatusAndCategory("Open", "Vocabulary");
    }

    public List<Question> getVocabularyQuestionsByGameSessionId(Long id) {
        return gameSessionRepository.findById(id)
                .map(GameBank::getQuestions)
                .orElse(Collections.emptyList());
    }

    public void updateClassRoom(GameBank session, Long classRoomId) {
        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new RuntimeException("ClassRoom not found"));
        session.setClassRoom(classRoom);
        session.setLastModified(java.time.LocalDateTime.now());
        gameSessionRepository.save(session);
    }
}
