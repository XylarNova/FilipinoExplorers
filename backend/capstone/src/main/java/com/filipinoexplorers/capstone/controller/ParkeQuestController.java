package com.filipinoexplorers.capstone.controller;


import com.filipinoexplorers.capstone.dto.ParkeQuestResultDTO;
import com.filipinoexplorers.capstone.dto.ParkeQuestAnswerDTO;



import com.filipinoexplorers.capstone.dto.ParkeQuestDTO;
import com.filipinoexplorers.capstone.entity.ParkeQuestChoice;
import com.filipinoexplorers.capstone.entity.ParkeQuestQuestion;
import com.filipinoexplorers.capstone.entity.ParkeQuestScore;
import com.filipinoexplorers.capstone.repository.ParkeQuestChoiceRepository;
import com.filipinoexplorers.capstone.repository.ParkeQuestQuestionRepository;
import com.filipinoexplorers.capstone.repository.ParkeQuestScoreRepository;
import com.filipinoexplorers.capstone.service.ParkeQuestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/parkequest")
@CrossOrigin
public class ParkeQuestController {
    private final ParkeQuestService service;
    @Autowired
private ParkeQuestQuestionRepository parkeQuestQuestionRepository;

@Autowired
private ParkeQuestChoiceRepository parkeQuestChoiceRepository;

@Autowired
private ParkeQuestScoreRepository parkeQuestScoreRepository;


    public ParkeQuestController(ParkeQuestService service) {
        this.service = service;
    }

    @GetMapping
    public List<ParkeQuestQuestion> getAll() {
        return service.getAll();
    }

    @PostMapping
public ResponseEntity<ParkeQuestQuestion> save(@RequestBody ParkeQuestDTO dto) {
    ParkeQuestQuestion question = new ParkeQuestQuestion();
    question.setStory(dto.getStory());
    question.setQuestion(dto.getQuestion());
    question.setCorrectAnswer(dto.getCorrectAnswer());
    question.setHint(dto.getHint()); // ✅ add this line


    List<ParkeQuestChoice> choiceList = dto.getChoices().stream().map(choiceText -> {
        ParkeQuestChoice choice = new ParkeQuestChoice();
        choice.setChoice(choiceText);
        choice.setQuestion(question); // important
        return choice;
    }).collect(Collectors.toList());

    question.setChoices(choiceList);
   return ResponseEntity.ok(parkeQuestQuestionRepository.save(question)); // ✅ correct

}


@PostMapping("/check")
public ResponseEntity<ParkeQuestResultDTO> checkAnswer(@RequestBody ParkeQuestAnswerDTO answerDTO) {
    ParkeQuestQuestion question = parkeQuestQuestionRepository.findById(answerDTO.getQuestionId())
        .orElse(null);

    if (question == null) {
        return ResponseEntity.badRequest().body(new ParkeQuestResultDTO(false, 0, "Question not found"));
    }

    String correct = question.getCorrectAnswer().trim().toLowerCase().replaceAll("[\\p{Punct}]", "");
    String submitted = answerDTO.getSelectedAnswer().trim().toLowerCase().replaceAll("[\\p{Punct}]", "");

    System.out.println("✔️ CORRECT:   " + correct);
    System.out.println("🧪 SUBMITTED: " + submitted);

    boolean isCorrect = correct.equals(submitted);
    int score = isCorrect ? (answerDTO.isUsedHint() ? 2 : 1) : (answerDTO.isUsedHint() ? 1 : 0);
    String message = isCorrect ? "CORRECT ANSWER" : "WRONG ANSWER";

    return ResponseEntity.ok(new ParkeQuestResultDTO(isCorrect, score, message));
}

@DeleteMapping("/{id}")
public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
    parkeQuestQuestionRepository.deleteById(id);
    return ResponseEntity.ok("Question deleted successfully.");
}

@PutMapping("/{id}")
public ResponseEntity<String> updateQuestion(@PathVariable Long id, @RequestBody ParkeQuestDTO dto) {
    ParkeQuestQuestion question = parkeQuestQuestionRepository.findById(id).orElse(null);
    if (question == null) {
        return ResponseEntity.badRequest().body("Question not found.");
    }

    question.setStory(dto.getStory());
    question.setQuestion(dto.getQuestion());
    question.setCorrectAnswer(dto.getCorrectAnswer());
    question.setHint(dto.getHint());

    // ✅ SAFELY MODIFY the existing collection
    question.getChoices().clear(); // Hibernate will treat cleared ones as orphans and delete them

    for (String choiceText : dto.getChoices()) {
        ParkeQuestChoice c = new ParkeQuestChoice();
        c.setChoice(choiceText);
        c.setQuestion(question); // set back-reference
        question.getChoices().add(c);
    }

    parkeQuestQuestionRepository.save(question);
    return ResponseEntity.ok("Question updated successfully.");
}



@PostMapping("/submit-score")
public ResponseEntity<String> submitScore(@RequestBody ParkeQuestScore score) {
    parkeQuestScoreRepository.save(score);
    return ResponseEntity.ok("Score saved.");
}


}