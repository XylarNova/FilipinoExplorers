package com.filipinoexplorers.capstone.service;

import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.entity.PaaralanQuest;
import com.filipinoexplorers.capstone.repository.PaaralanQuestRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaaralanQuestService {
    
    private final PaaralanQuestRepository repository;

    public PaaralanQuest save(PaaralanQuest paaralanQuest) {
        return repository.save(paaralanQuest);
    }

    public List<PaaralanQuest> findAll() {
        return repository.findAll();
    }

    public Optional<PaaralanQuest> findById(Long id) {
        return repository.findById(id);
    }

    public PaaralanQuest update(Long id, PaaralanQuest updated) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setStory(updated.getStory());
                    existing.setQuestion(updated.getQuestion());
                    existing.setChoices(updated.getChoices());
                    existing.setCorrectAnswer(updated.getCorrectAnswer());
                    existing.setHint(updated.getHint());
                    return repository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("PaaralanQuest not found"));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
