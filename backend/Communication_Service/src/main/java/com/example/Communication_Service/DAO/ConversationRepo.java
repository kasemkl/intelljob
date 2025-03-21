package com.example.Communication_Service.DAO;

import com.example.Communication_Service.Model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepo extends MongoRepository<Conversation, String> {
    Optional<Conversation> findBySenderIdAndRecipientId(String senderId, String recipientId);

    List<Conversation> findBySenderIdOrRecipientId(String userId, String userId1);
}
