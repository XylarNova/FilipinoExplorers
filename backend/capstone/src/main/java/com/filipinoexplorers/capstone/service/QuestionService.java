package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.Question;
import com.filipinoexplorers.capstone.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();  
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);  
    }

    public Question updateQuestion(Long id, Question updatedQuestion) {
        Optional<Question> existingQuestion = questionRepository.findById(id);
        if (existingQuestion.isPresent()) {
            Question question = existingQuestion.get();
            question.setTagalogWord(updatedQuestion.getTagalogWord());  
            question.setCorrectAnswer(updatedQuestion.getCorrectAnswer());  
            question.setChoices(updatedQuestion.getChoices());  
            question.setHint(updatedQuestion.getHint());  
            return questionRepository.save(question);  
        }
        return null;  
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);  
    }
}
