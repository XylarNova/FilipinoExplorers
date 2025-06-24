package com.filipinoexplorers.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filipinoexplorers.capstone.entity.MGQuestion;

public interface MGQuestionRepository extends JpaRepository<MGQuestion, Long> {
}
