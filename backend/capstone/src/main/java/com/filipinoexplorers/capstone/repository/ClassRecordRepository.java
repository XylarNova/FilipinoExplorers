package com.filipinoexplorers.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filipinoexplorers.capstone.entity.ClassRecord;

public interface ClassRecordRepository extends JpaRepository<ClassRecord, Long> {
}
