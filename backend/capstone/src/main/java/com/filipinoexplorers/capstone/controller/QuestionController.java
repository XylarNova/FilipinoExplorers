package com.filipinoexplorers.capstone.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.filipinoexplorers.capstone.entity.Question;
import com.filipinoexplorers.capstone.service.QuestionService;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService service;

    @GetMapping("/get")
    public List<Question> getQuestions() {
        return service.getAllQuestions();
    }

    @PostMapping("/post")
    public Question addQuestion(@RequestBody Question question) {
        return service.createQuestion(question);
    }

    @PutMapping("/update/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        return service.updateQuestion(id, question);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        service.deleteQuestion(id);
    }
}
