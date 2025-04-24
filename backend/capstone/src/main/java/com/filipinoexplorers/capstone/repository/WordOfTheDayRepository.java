package com.filipinoexplorers.capstone.repository;

import com.filipinoexplorers.capstone.entity.WordOfTheDay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordOfTheDayRepository extends JpaRepository<WordOfTheDay, Long> {
}
