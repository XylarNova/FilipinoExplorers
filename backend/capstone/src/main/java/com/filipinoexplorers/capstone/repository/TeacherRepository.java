package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.TeacherEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<TeacherEntity, Long> {
    TeacherEntity findByEmail(String email);

    // Method to check if a teacher with the given email exists
    boolean existsByEmail(String email);
}