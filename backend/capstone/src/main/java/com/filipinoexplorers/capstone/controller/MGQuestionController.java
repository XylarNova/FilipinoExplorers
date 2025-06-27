package com.filipinoexplorers.capstone.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.filipinoexplorers.capstone.entity.MGQuestion;
import com.filipinoexplorers.capstone.service.MGQuestionService;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MGQuestionController {

    private final MGQuestionService service;

    @GetMapping("/get")
    public List<MGQuestion> getQuestions() {
        return service.getAllQuestions();
    }

    @PostMapping("/post")
    public MGQuestion addQuestion(@RequestBody MGQuestion question) {
        return service.createQuestion(question);
    }

    @PutMapping("/update/{id}")
    public MGQuestion updateQuestion(@PathVariable Long id, @RequestBody MGQuestion question) {
        return service.updateQuestion(id, question);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        service.deleteQuestion(id);
    }
}
