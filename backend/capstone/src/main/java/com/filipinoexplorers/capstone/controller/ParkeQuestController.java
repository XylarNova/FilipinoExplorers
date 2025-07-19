package com.filipinoexplorers.capstone.controller;
import java.util.Optional;



import com.filipinoexplorers.capstone.dto.ParkeQuestResultDTO;
import com.filipinoexplorers.capstone.dto.ParkeQuestStudentScoreRequest;
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

import java.time.LocalDateTime;
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
        question.setHint(dto.getHint());



        List<ParkeQuestChoice> choiceList = dto.getChoices().stream().map(choiceText -> {
        ParkeQuestChoice choice = new ParkeQuestChoice();
        choice.setChoice(choiceText);
        choice.setQuestion(question); 
        return choice;
        }).collect(Collectors.toList());

        question.setChoices(choiceList);
        return ResponseEntity.ok(parkeQuestQuestionRepository.save(question)); 

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




        question.getChoices().clear(); 

        for (String choiceText : dto.getChoices()) {
            ParkeQuestChoice c = new ParkeQuestChoice();
            c.setChoice(choiceText);
            c.setQuestion(question); 
            question.getChoices().add(c);
        }

        parkeQuestQuestionRepository.save(question);
        return ResponseEntity.ok("Question updated successfully.");
    }

    @PostMapping("/submit-score")
        public ResponseEntity<String> submitScore(@RequestBody ParkeQuestScore score) {
            System.out.println("📥 Score received: " + score.getScore());
            System.out.println("👤 Student: " + score.getStudentName());
            System.out.println("🕒 Timestamp: " + score.getTimestamp());

            parkeQuestScoreRepository.save(score);
            return ResponseEntity.ok("Score saved.");
        }




    @GetMapping("/timer")
    public ResponseEntity<Integer> getGlobalTimer() {
        return ResponseEntity.ok(service.getGlobalTimer()); // ✅ use service
    }

    @PostMapping("/timer")
    public ResponseEntity<String> updateGlobalTimer(@RequestParam int seconds) {
        if (seconds < 10 || seconds > 3600) {
            return ResponseEntity.badRequest().body("Timer must be between 10 and 3600 seconds.");
        }
        service.setGlobalTimer(seconds); // ✅ use service
        return ResponseEntity.ok("⏱️ Timer updated to " + seconds + " seconds.");
    }


    @GetMapping("/scores")
        public ResponseEntity<List<ParkeQuestScore>> getAllScores() {
            return ResponseEntity.ok(parkeQuestScoreRepository.findAll());
        }


    @PutMapping("/scores/{id}")
        public ResponseEntity<?> updateScore(@PathVariable Long id, @RequestBody ParkeQuestStudentScoreRequest request) {
            Optional<ParkeQuestScore> optional = parkeQuestScoreRepository.findById(id);
            if (optional.isEmpty()) return ResponseEntity.notFound().build();

            ParkeQuestScore score = optional.get();

                score.setStudentName(request.getStudentName());
                score.setScore(request.getScore());
                score.setTimestamp(java.sql.Timestamp.valueOf(LocalDateTime.now()));
                parkeQuestScoreRepository.save(score);

            return ResponseEntity.ok("✅ Score updated.");
        }

        @DeleteMapping("/scores/{id}")
            public ResponseEntity<?> deleteScore(@PathVariable Long id) {
                if (!parkeQuestScoreRepository.existsById(id)) {
                    return ResponseEntity.notFound().build();
                }

                parkeQuestScoreRepository.deleteById(id);
                return ResponseEntity.ok("🗑️ Score deleted.");
            }




}