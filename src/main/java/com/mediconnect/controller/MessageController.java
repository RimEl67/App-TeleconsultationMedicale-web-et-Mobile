package com.mediconnect.controller;

import com.mediconnect.entity.Message;
import com.mediconnect.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<Message>> getByUser(@RequestParam Long userId) {
        return ResponseEntity.ok(messageService.findByUserId(userId));
    }
    
    @PostMapping
    public ResponseEntity<Message> send(@RequestBody Message message) {
        return ResponseEntity.ok(messageService.send(message));
    }
}
