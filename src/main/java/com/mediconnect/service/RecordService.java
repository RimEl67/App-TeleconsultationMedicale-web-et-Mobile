package com.mediconnect.service;

import com.mediconnect.entity.Record;
import com.mediconnect.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;

    public List<Record> getAll() {
        return recordRepository.findAll();
    }

    public Record save(Record record) {
        return recordRepository.save(record);
    }
}
