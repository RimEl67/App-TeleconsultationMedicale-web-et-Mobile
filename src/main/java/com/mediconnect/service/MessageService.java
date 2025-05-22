package com.mediconnect.service;

import com.mediconnect.entity.Message;
import com.mediconnect.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public Message send(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    public List<Message> findByUserId(Long userId) {
        return messageRepository.findBySenderIdOrRecipientId(userId, userId);
    }
}
