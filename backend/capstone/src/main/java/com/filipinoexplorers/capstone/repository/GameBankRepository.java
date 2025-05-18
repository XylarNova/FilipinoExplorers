package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.ClassRoom;
import com.filipinoexplorers.capstone.entity.GameBank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameBankRepository extends JpaRepository<GameBank, Long> {
    List<GameBank> findByCategory(String category);
    List<GameBank> findByQuarter(String quarter);
    List<GameBank> findByReview(boolean review);
    List<GameBank> findByLeaderboard(boolean leaderboard);
    List<GameBank> findByHints(boolean hints);

    // Optional methods
    List<GameBank> findByStatus(String status);
    List<GameBank> findByClassRoom_Id(Long classRoomId);
    List<GameBank> findByClassRoom(ClassRoom classRoom);
    List<GameBank> findByClassRoomAndStatus(ClassRoom classRoom, String status);

    // Combined filters
    List<GameBank> findByCategoryAndQuarterAndReview(String category, String quarter, boolean review);
    List<GameBank> findByCategoryAndQuarter(String category, String quarter);
    List<GameBank> findByCategoryAndReview(String category, boolean review);
    List<GameBank> findByQuarterAndReview(String quarter, boolean review);
    List<GameBank> findByStatusAndCategory(String string, String string2);
}

