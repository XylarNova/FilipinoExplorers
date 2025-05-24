package com.filipinoexplorers.capstone.repository;
import com.filipinoexplorers.capstone.entity.GameBank;


import com.filipinoexplorers.capstone.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameBankRepository extends JpaRepository<GameBank, Long> {
    List<GameBank> findByCategory(String category);
    List<GameBank> findByQuarter(String quarter);
    List<GameBank> findByReview(boolean review);
    List<GameBank> findByLeaderboard(boolean leaderboard);
    List<GameBank> findByHints(boolean hints);
    List<GameBank> findByStatus(String status);

    // ✅ Correct classroom-based query
    List<GameBank> findByClassrooms_Id(Long classRoomId);

    // Teacher-based filters
    List<GameBank> findByTeacher_TeacherId(Long teacherId);
    List<GameBank> findByTeacherEmail(String email);
    List<GameBank> findByTeacher(Teacher teacher);

    // Combined filters
    List<GameBank> findByCategoryAndQuarterAndReview(String category, String quarter, boolean review);
    List<GameBank> findByCategoryAndQuarter(String category, String quarter);
    List<GameBank> findByCategoryAndReview(String category, boolean review);
    List<GameBank> findByQuarterAndReview(String quarter, boolean review);
    List<GameBank> findByStatusAndCategory(String status, String category);
}
