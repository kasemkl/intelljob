package com.example.Communication_Service.DAO;

import com.example.Communication_Service.Model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatNotificationRepo extends MongoRepository<Conversation, String> {
}
