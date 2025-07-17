package com.filipinoexplorers.capstone.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filipinoexplorers.capstone.entity.ClassRecord;
import com.filipinoexplorers.capstone.repository.ClassRecordRepository;
import com.filipinoexplorers.capstone.service.ClassRecordService;
import com.filipinoexplorers.capstone.service.ExcelExportService;

@RestController
@RequestMapping("/api/class-records")
@CrossOrigin(origins = "http://localhost:5173")
public class ClassRecordController {

    @Autowired
    private ClassRecordRepository repository;

    @Autowired
    private ExcelExportService excelExportService;

    @Autowired
    private ClassRecordService service;

    @PostMapping("/save")
    public ClassRecord saveRecord(@RequestBody ClassRecord record) {
        return service.saveRecord(record); 
    }

    // @GetMapping("/export")
    // public ResponseEntity<byte[]> exportClassRecord() {
    //     List<ClassRecord> records = repository.findAll();
    //     return excelExportService.exportToExcel(records);
    // }

    // temporary endpoint for testing
    // This will be removed later when the frontend is ready to send actual data
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportClassRecord() {
        List<ClassRecord> dummyData = List.of(
            new ClassRecord(null, "Juan Dela Cruz", "10,15,12", 37),
            new ClassRecord(null, "Maria Santos", "8,10,9", 27),
            new ClassRecord(null, "Carlos Reyes", "12,14,11", 37)
        );

        return excelExportService.exportToExcel(dummyData);
    }

}
