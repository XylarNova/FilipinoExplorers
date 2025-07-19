package com.filipinoexplorers.capstone.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.entity.ClassRecord;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ExcelExportService {

    public ResponseEntity<byte[]> exportToExcel(List<ClassRecord> records) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Class Records");

            // Header
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Student Name");
            header.createCell(1).setCellValue("Activity Scores");
            header.createCell(2).setCellValue("Total Score");

            for (int i = 0; i < records.size(); i++) {
                ClassRecord rec = records.get(i);
                Row row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(rec.getStudentName());
                row.createCell(1).setCellValue(rec.getActivityScores());
                row.createCell(2).setCellValue(rec.getTotalScore());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=class_record.xlsx");

            return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

