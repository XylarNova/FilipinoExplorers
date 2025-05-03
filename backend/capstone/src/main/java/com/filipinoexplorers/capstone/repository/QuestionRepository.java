package com.filipinoexplorers.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filipinoexplorers.capstone.entity.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
