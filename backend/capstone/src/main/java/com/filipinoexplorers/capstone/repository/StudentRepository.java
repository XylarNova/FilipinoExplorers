package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    StudentEntity findByEmail(String email);

    // Method to check if a student with the given email exists
    boolean existsByEmail(String email);
}