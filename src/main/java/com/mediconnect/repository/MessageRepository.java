package com.mediconnect.repository;

import com.mediconnect.entity.Message;
import com.mediconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdOrRecipientId(Long senderId, Long recipientId);
}
