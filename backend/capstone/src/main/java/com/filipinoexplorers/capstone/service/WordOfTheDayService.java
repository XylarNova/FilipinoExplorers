package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.WordOfTheDay;
import com.filipinoexplorers.capstone.repository.WordOfTheDayRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WordOfTheDayService {

    private final WordOfTheDayRepository repository;

    public WordOfTheDayService(WordOfTheDayRepository repository) {
        this.repository = repository;
    }

    public WordOfTheDay save(WordOfTheDay word) {
        return repository.save(word);
    }

    public List<WordOfTheDay> findAll() {
        return repository.findAll();
    }
}
