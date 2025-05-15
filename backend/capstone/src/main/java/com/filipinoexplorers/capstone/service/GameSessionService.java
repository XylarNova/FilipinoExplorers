package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.GameSession;
import com.filipinoexplorers.capstone.entity.Question;
import com.filipinoexplorers.capstone.repository.GameSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameSessionService {

    private final GameSessionRepository gameSessionRepository;

    public List<GameSession> getAllGameSessions() {
        return gameSessionRepository.findAll();
    }

    public GameSession saveGameSession(GameSession gameSession) {
        return gameSessionRepository.save(gameSession);
    }

    public Optional<GameSession> getGameSessionById(Long id) {
        return gameSessionRepository.findById(id);
    }

    public GameSession createGameSession(GameSession gameSession) {
        return gameSessionRepository.save(gameSession);
    }

    public GameSession updateGameSession(Long id, GameSession updatedSession) {
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
                existing.setClassRoom(updatedSession.getClassRoom()); // New line
                return gameSessionRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("GameSession not found"));
    }

    public void deleteGameSession(Long id) {
        gameSessionRepository.deleteById(id);
    }

    public List<GameSession> getByCategory(String category) {
        return gameSessionRepository.findByCategory(category);
    }
    
    public List<GameSession> getByQuarter(String quarter) {
        return gameSessionRepository.findByQuarter(quarter);
    }
    
    public List<GameSession> getByReview(boolean review) {
        return gameSessionRepository.findByReview(review);
    }
    
    public List<GameSession> getByLeaderboard(boolean leaderboard) {
        return gameSessionRepository.findByLeaderboard(leaderboard);
    }
    
    public List<GameSession> getByHints(boolean hints) {
        return gameSessionRepository.findByHints(hints);
    }

    public List<GameSession> getByCategoryAndQuarterAndReview(String category, String quarter, boolean review) {
        return gameSessionRepository.findByCategoryAndQuarterAndReview(category, quarter, review);
    }
    
    public List<GameSession> getByCategoryAndQuarter(String category, String quarter) {
        return gameSessionRepository.findByCategoryAndQuarter(category, quarter);
    }
    
    public List<GameSession> getByCategoryAndReview(String category, boolean review) {
        return gameSessionRepository.findByCategoryAndReview(category, review);
    }
    
    public List<GameSession> getByQuarterAndReview(String quarter, boolean review) {
        return gameSessionRepository.findByQuarterAndReview(quarter, review);
    }    
    
    public List<GameSession> getByStatus(String status) {
        return gameSessionRepository.findByStatus(status);
    }
    
    public List<GameSession> getByClassRoomId(Long classRoomId) {
        return gameSessionRepository.findByClassRoom_Id(classRoomId);
    }    

    public List<GameSession> getOpenVocabularyGames() {
        return gameSessionRepository.findByStatusAndCategory("Open", "Vocabulary");
    }

    public List<Question> getVocabularyQuestionsByGameSessionId(Long id) {
        return gameSessionRepository.findById(id)
                .map(GameSession::getQuestions) 
                .orElse(Collections.emptyList());
    }
     
    
}
