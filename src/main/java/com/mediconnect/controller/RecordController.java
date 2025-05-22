package com.mediconnect.controller;

import com.mediconnect.entity.Record;
import com.mediconnect.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecordController {

    private final RecordService recordService;

    @GetMapping
    public ResponseEntity<List<Record>> getAll() {
        return ResponseEntity.ok(recordService.getAll());
    }

    @PostMapping
    public ResponseEntity<Record> create(@RequestBody Record record) {
        return ResponseEntity.ok(recordService.save(record));
    }
}
