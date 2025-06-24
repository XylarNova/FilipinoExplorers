package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.MGQuestion;
import com.filipinoexplorers.capstone.repository.MGQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MGQuestionService {

    private final MGQuestionRepository questionRepository;

    public List<MGQuestion> getAllQuestions() {
        return questionRepository.findAll();
    }

    public MGQuestion createQuestion(MGQuestion question) {
        return questionRepository.save(question);
    }

    public MGQuestion updateQuestion(Long id, MGQuestion updatedQuestion) {
        return questionRepository.findById(id)
                .map(question -> {
                    question.setTagalogWord(updatedQuestion.getTagalogWord());
                    question.setCorrectAnswer(updatedQuestion.getCorrectAnswer());
                    question.setChoices(updatedQuestion.getChoices());
                    question.setHint(updatedQuestion.getHint());
                    return questionRepository.save(question);
                })
                .orElse(null);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
