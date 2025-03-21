package com.example.Communication_Service.DAO;

import com.example.Communication_Service.Model.Message;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepo  extends MongoRepository<Message, String> {
    List<Message> findByChatId(String s);

    // استخدم استعلام مخصص لجلب آخر رسالة بناءً على chatId وترتيبها بناءً على messageTime
    @Aggregation(pipeline = {
            "{ $match: { 'chatId': ?0 } }",
            "{ $sort: { 'timestamp': -1 } }",
            "{ $limit: 1 }"
    })
    Message findLastMessageByChatId(String chatId);
}

