package com.filipinoexplorers.capstone.service;

import com.filipinoexplorers.capstone.entity.GuessTheWordEntity;
import com.filipinoexplorers.capstone.entity.Student;
import com.filipinoexplorers.capstone.repository.GuessTheWordRepository;
import com.filipinoexplorers.capstone.repository.StudentRepository;
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
    
    @Autowired
    private StudentRepository studentRepo;
    
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
    
    // Enhanced checkAnswer method that also records student progress
    public boolean checkAnswerWithStudentTracking(Long puzzleId, String answer, Long studentId) {
        Optional<GuessTheWordEntity> puzzleOpt = guessRepo.findById(puzzleId);
        Optional<Student> studentOpt = studentRepo.findById(studentId);
        
        if (puzzleOpt.isPresent() && studentOpt.isPresent()) {
            GuessTheWordEntity puzzle = puzzleOpt.get();
            Student student = studentOpt.get();
            
            boolean isCorrect = puzzle.getWord().equalsIgnoreCase(answer);
            
            if (isCorrect) {
                // Add the puzzle to student's played puzzles
                student.getPlayedPuzzles().add(puzzle);
                puzzle.getPlayedByStudents().add(student);
                
                // Save both entities to update the relationship
                studentRepo.save(student);
                guessRepo.save(puzzle);
            }
            
            return isCorrect;
        }
        return false;
    }
    
    public String getHint(Long puzzleId) {
        Optional<GuessTheWordEntity> puzzle = guessRepo.findById(puzzleId);
        return puzzle.map(GuessTheWordEntity::getHint).orElse("No hint available");
    }
    
    // Get next active puzzle for gameplay, excluding already played puzzles for a student
    public Optional<GuessTheWordEntity> getNextPuzzle(Long currentPuzzleId, Long studentId) {
        List<GuessTheWordEntity> activePuzzles = getActivePuzzles();
        
        // If no active puzzles defined, get all puzzles (for backward compatibility)
        if (activePuzzles.isEmpty()) {
            activePuzzles = getAllPuzzles();
        }
        
        // Get student's played puzzles if studentId is provided
        List<GuessTheWordEntity> playedPuzzles = new ArrayList<>();
        if (studentId != null) {
            Optional<Student> studentOpt = studentRepo.findById(studentId);
            if (studentOpt.isPresent()) {
                playedPuzzles = new ArrayList<>(studentOpt.get().getPlayedPuzzles());
            }
        }
        
        for (int i = 0; i < activePuzzles.size(); i++) {
            if (activePuzzles.get(i).getId().equals(currentPuzzleId)) {
                // Look for next unplayed puzzle
                for (int j = i + 1; j < activePuzzles.size(); j++) {
                    GuessTheWordEntity nextPuzzle = activePuzzles.get(j);
                    // Check if student hasn't played this puzzle yet
                    if (studentId == null || !playedPuzzles.contains(nextPuzzle)) {
                        return Optional.of(nextPuzzle);
                    }
                }
                break;
            }
        }
        
        return Optional.empty();
    }
    
    // Get next active puzzle for gameplay (original method for backward compatibility)
    public Optional<GuessTheWordEntity> getNextPuzzle(Long currentPuzzleId) {
        return getNextPuzzle(currentPuzzleId, null);
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
    
    // Get the first active puzzle for gameplay, excluding already played puzzles for a student
    public Optional<GuessTheWordEntity> getFirstActivePuzzle(Long studentId) {
        List<GuessTheWordEntity> activePuzzles = getActivePuzzles();
        
        if (activePuzzles.isEmpty()) {
            // Fallback to all puzzles if no active puzzles
            activePuzzles = getAllPuzzles();
        }
        
        if (studentId != null) {
            // Get student's played puzzles
            Optional<Student> studentOpt = studentRepo.findById(studentId);
            if (studentOpt.isPresent()) {
                List<GuessTheWordEntity> playedPuzzles = new ArrayList<>(studentOpt.get().getPlayedPuzzles());
                
                // Find the first unplayed puzzle
                for (GuessTheWordEntity puzzle : activePuzzles) {
                    if (!playedPuzzles.contains(puzzle)) {
                        return Optional.of(puzzle);
                    }
                }
            }
        }
        
        // If no student specified or all puzzles played, return first active puzzle
        if (!activePuzzles.isEmpty()) {
            return Optional.of(activePuzzles.get(0));
        }
        
        return Optional.empty();
    }
    
    // Get the first active puzzle for gameplay (original method for backward compatibility)
    public Optional<GuessTheWordEntity> getFirstActivePuzzle() {
        return getFirstActivePuzzle(null);
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
    
    // Get student's progress - puzzles they have completed
    public List<GuessTheWordEntity> getStudentCompletedPuzzles(Long studentId) {
        Optional<Student> studentOpt = studentRepo.findById(studentId);
        if (studentOpt.isPresent()) {
            return new ArrayList<>(studentOpt.get().getPlayedPuzzles());
        }
        return new ArrayList<>();
    }
    
    // Get puzzles not yet played by a student
    public List<GuessTheWordEntity> getUnplayedPuzzlesForStudent(Long studentId) {
        List<GuessTheWordEntity> allActivePuzzles = getActivePuzzles();
        if (allActivePuzzles.isEmpty()) {
            allActivePuzzles = getAllPuzzles();
        }
        
        List<GuessTheWordEntity> playedPuzzles = getStudentCompletedPuzzles(studentId);
        
        List<GuessTheWordEntity> unplayedPuzzles = new ArrayList<>();
        for (GuessTheWordEntity puzzle : allActivePuzzles) {
            if (!playedPuzzles.contains(puzzle)) {
                unplayedPuzzles.add(puzzle);
            }
        }
        
        return unplayedPuzzles;
    }
    
    // Check if student has completed a specific puzzle
    public boolean hasStudentCompletedPuzzle(Long studentId, Long puzzleId) {
        Optional<Student> studentOpt = studentRepo.findById(studentId);
        if (studentOpt.isPresent()) {
            return studentOpt.get().getPlayedPuzzles().stream()
                    .anyMatch(puzzle -> puzzle.getId().equals(puzzleId));
        }
        return false;
    }
    
    // Get student's total score from completed puzzles
    public Integer getStudentTotalScore(Long studentId) {
        List<GuessTheWordEntity> completedPuzzles = getStudentCompletedPuzzles(studentId);
        return completedPuzzles.stream()
                .mapToInt(puzzle -> puzzle.getScore() != null ? puzzle.getScore() : 0)
                .sum();
    }
    
    // Reset student's progress (remove all played puzzles)
    public void resetStudentProgress(Long studentId) {
        Optional<Student> studentOpt = studentRepo.findById(studentId);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            
            // Remove student from all puzzles' playedByStudents set
            for (GuessTheWordEntity puzzle : student.getPlayedPuzzles()) {
                puzzle.getPlayedByStudents().remove(student);
                guessRepo.save(puzzle);
            }
            
            // Clear student's played puzzles
            student.getPlayedPuzzles().clear();
            studentRepo.save(student);
        }
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