package com.filipinoexplorers.capstone.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.filipinoexplorers.capstone.dto.PaaralanQuestRequest;
import com.filipinoexplorers.capstone.dto.PaaralanQuestResponse;
import com.filipinoexplorers.capstone.entity.PaaralanQuest;
import com.filipinoexplorers.capstone.mapper.PaaralanQuestMapper;
import com.filipinoexplorers.capstone.service.PaaralanQuestService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/story-questions")
@RequiredArgsConstructor
public class PaaralanQuestController {
    
    private final PaaralanQuestService paaralanQuestService;

    @PostMapping
    public ResponseEntity<PaaralanQuestResponse> create(@RequestBody PaaralanQuestRequest dto) {
        PaaralanQuest saved = paaralanQuestService.save(PaaralanQuestMapper.toEntity(dto));
        return ResponseEntity.ok(PaaralanQuestMapper.toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<List<PaaralanQuestResponse>> getAll() {
        List<PaaralanQuestResponse> result = paaralanQuestService.findAll().stream()
                .map(PaaralanQuestMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaaralanQuestResponse> getById(@PathVariable Long id) {
        return paaralanQuestService.findById(id)
                .map(PaaralanQuestMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaaralanQuestResponse> update(@PathVariable Long id,
                                                           @RequestBody PaaralanQuestRequest dto) {
        PaaralanQuest updated = paaralanQuestService.update(id, PaaralanQuestMapper.toEntity(dto));
        return ResponseEntity.ok(PaaralanQuestMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paaralanQuestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
