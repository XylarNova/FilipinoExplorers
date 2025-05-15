package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.ClassRoom;
import com.filipinoexplorers.capstone.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    List<GameSession> findByCategory(String category);
    List<GameSession> findByQuarter(String quarter);
    List<GameSession> findByReview(boolean review);
    List<GameSession> findByLeaderboard(boolean leaderboard);
    List<GameSession> findByHints(boolean hints);

    // Optional methods
    List<GameSession> findByStatus(String status);
    List<GameSession> findByClassRoom_Id(Long classRoomId);
    List<GameSession> findByClassRoom(ClassRoom classRoom);
    List<GameSession> findByClassRoomAndStatus(ClassRoom classRoom, String status);

    // Combined filters
    List<GameSession> findByCategoryAndQuarterAndReview(String category, String quarter, boolean review);
    List<GameSession> findByCategoryAndQuarter(String category, String quarter);
    List<GameSession> findByCategoryAndReview(String category, boolean review);
    List<GameSession> findByQuarterAndReview(String quarter, boolean review);
    List<GameSession> findByStatusAndCategory(String string, String string2);
}

