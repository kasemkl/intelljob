package com.example.Communication_Service.Service;


import com.example.Communication_Service.DAO.MessageRepo;
import com.example.Communication_Service.Model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;


@Service
public class MessageService {

    @Autowired
    private  MessageRepo messageRepo;
    @Autowired
    private  ConversationService conversationService;




    public Message saveMessage(Message message){
        var chatId = conversationService.getConversationId(
                message.getSenderId(),
                message.getRecipientId(),
                true

        ).orElseThrow(() -> new NoSuchElementException("Sender not found")) ;
        message.setChatId(chatId);
        messageRepo.save(message);
                return message;

    }

    public List<Message> findMessages(
            String senderId,
            String recipientId
    ){
        var chatId = conversationService.getConversationId(senderId,recipientId,false);
        return chatId.map(messageRepo::findByChatId).orElse(new ArrayList<>());
    }


}
