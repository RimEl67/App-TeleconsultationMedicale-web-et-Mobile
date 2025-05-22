package com.mediconnect.repository;

import com.mediconnect.entity.Record;
import com.mediconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {
    List<Record> findByPatient(User patient);
}
