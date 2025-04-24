package com.filipinoexplorers.capstone.controller;

import com.filipinoexplorers.capstone.entity.WordOfTheDay;
import com.filipinoexplorers.capstone.service.WordOfTheDayService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/words")
@CrossOrigin(origins = "http://localhost:5173")
public class WordOfTheDayController {

    private final WordOfTheDayService service;

    public WordOfTheDayController(WordOfTheDayService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<WordOfTheDay> addWord(@RequestBody WordOfTheDay word) {
        WordOfTheDay saved = service.save(word);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/get")
    public ResponseEntity<WordOfTheDay> getWordOfTheDay() {
        Optional<WordOfTheDay> wordOfTheDay = service.findAll().stream().findFirst(); 
        return wordOfTheDay.map(word -> new ResponseEntity<>(word, HttpStatus.OK))
                           .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
