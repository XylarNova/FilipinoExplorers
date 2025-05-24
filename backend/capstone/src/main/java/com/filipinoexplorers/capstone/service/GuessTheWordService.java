package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.GuessTheWordEntity;
import com.filipinoexplorers.capstone.repository.GuessTheWordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class GuessTheWordService {
    @Autowired
    private GuessTheWordRepository guessRepo;
    
    public List<GuessTheWordEntity> getAllPuzzles() {
        return guessRepo.findAll();
    }
    
    public List<GuessTheWordEntity> getActivePuzzles() {
        return guessRepo.findByActiveTrue();
    }
    
    public Optional<GuessTheWordEntity> getPuzzleById(Long id) {
        return guessRepo.findById(id);
    }
    
    public GuessTheWordEntity savePuzzle(GuessTheWordEntity puzzle) {
        // Generate shuffled letters if not provided
        if (puzzle.getShuffledLetters() == null || puzzle.getShuffledLetters().isEmpty()) {
            puzzle.setShuffledLetters(shuffleWord(puzzle.getWord()));
        }
        
        // Set default score if not provided
        if (puzzle.getScore() == null) {
            puzzle.setScore(10);
        }
        
        // Set default hint enabled if not provided
        if (puzzle.getHintEnabled() == null) {
            puzzle.setHintEnabled(true);
        }
        
        return guessRepo.save(puzzle);
    }
    
    public void deletePuzzle(Long id) {
        guessRepo.deleteById(id);
    }
    
    public boolean checkAnswer(Long puzzleId, String answer) {
        Optional<GuessTheWordEntity> puzzleOpt = guessRepo.findById(puzzleId);
        if (puzzleOpt.isPresent()) {
            return puzzleOpt.get().getWord().equalsIgnoreCase(answer);
        }
        return false;
    }
    
    public String getHint(Long puzzleId) {
        Optional<GuessTheWordEntity> puzzle = guessRepo.findById(puzzleId);
        return puzzle.map(GuessTheWordEntity::getHint).orElse("No hint available");
    }
    
    // Get next active puzzle for gameplay
    public Optional<GuessTheWordEntity> getNextPuzzle(Long currentPuzzleId) {
        List<GuessTheWordEntity> activePuzzles = getActivePuzzles();
        
        // If no active puzzles defined, get all puzzles (for backward compatibility)
        if (activePuzzles.isEmpty()) {
            activePuzzles = getAllPuzzles();
        }
        
        for (int i = 0; i < activePuzzles.size(); i++) {
            if (activePuzzles.get(i).getId().equals(currentPuzzleId)) {
                if (i + 1 < activePuzzles.size()) {
                    return Optional.of(activePuzzles.get(i + 1));
                }
                break;
            }
        }
        
        return Optional.empty();
    }
    
    // Set active puzzles for gameplay
    public void setActivePuzzles(List<Long> puzzleIds) {
        // First, mark all puzzles as inactive
        List<GuessTheWordEntity> allPuzzles = getAllPuzzles();
        for (GuessTheWordEntity puzzle : allPuzzles) {
            puzzle.setActive(false);
        }
        guessRepo.saveAll(allPuzzles);
        
        // Then, mark selected puzzles as active
        if (puzzleIds != null && !puzzleIds.isEmpty()) {
            for (Long id : puzzleIds) {
                Optional<GuessTheWordEntity> puzzleOpt = guessRepo.findById(id);
                if (puzzleOpt.isPresent()) {
                    GuessTheWordEntity puzzle = puzzleOpt.get();
                    puzzle.setActive(true);
                    guessRepo.save(puzzle);
                }
            }
        }
    }
    
    // Get the first active puzzle for gameplay
    public Optional<GuessTheWordEntity> getFirstActivePuzzle() {
        List<GuessTheWordEntity> activePuzzles = getActivePuzzles();
        
        if (!activePuzzles.isEmpty()) {
            return Optional.of(activePuzzles.get(0));
        } else {
            // Fallback to first puzzle in the database if no active puzzles
            List<GuessTheWordEntity> allPuzzles = getAllPuzzles();
            if (!allPuzzles.isEmpty()) {
                return Optional.of(allPuzzles.get(0));
            }
        }
        
        return Optional.empty();
    }
    
    // Update puzzle score
    public GuessTheWordEntity updatePuzzleScore(Long puzzleId, Integer score) {
        Optional<GuessTheWordEntity> puzzleOpt = guessRepo.findById(puzzleId);
        if (puzzleOpt.isPresent()) {
            GuessTheWordEntity puzzle = puzzleOpt.get();
            puzzle.setScore(score);
            return guessRepo.save(puzzle);
        }
        return null;
    }
    
    // Update hint status (enabled/disabled)
    public GuessTheWordEntity updateHintStatus(Long puzzleId, Boolean hintEnabled) {
        Optional<GuessTheWordEntity> puzzleOpt = guessRepo.findById(puzzleId);
        if (puzzleOpt.isPresent()) {
            GuessTheWordEntity puzzle = puzzleOpt.get();
            puzzle.setHintEnabled(hintEnabled);
            return guessRepo.save(puzzle);
        }
        return null;
    }
    
    // Shuffle a word and ensure all letters are included
    private String shuffleWord(String word) {
        List<Character> characters = new ArrayList<>();
        for (char c : word.toCharArray()) {
            characters.add(c);
        }
        
        Collections.shuffle(characters);
        StringBuilder shuffled = new StringBuilder();
        for (char c : characters) {
            shuffled.append(c);
        }
        
        return shuffled.toString();
    }
}