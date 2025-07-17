package com.filipinoexplorers.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.entity.ClassRecord;
import com.filipinoexplorers.capstone.repository.ClassRecordRepository;

import java.util.List;

@Service
public class ClassRecordService {

    @Autowired
    private ClassRecordRepository repository;

    public ClassRecord saveRecord(ClassRecord record) {
        record.calculateTotal(); // 👈 calculate total before saving
        return repository.save(record);
    }

    public List<ClassRecord> getAllRecords() {
        return repository.findAll();
    }
}

