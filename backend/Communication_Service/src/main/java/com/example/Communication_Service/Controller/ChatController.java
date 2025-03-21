package com.example.Communication_Service.Controller;

import com.example.Communication_Service.Service.MessageService;
import com.example.Communication_Service.DTO.ChatNotification;
import com.example.Communication_Service.Model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
@RestController
public class ChatController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void processMessage(
            @Payload Message message
    ) throws Exception {

        // إنشاء رسالة جديدة مع المحتوى المشفر
        Message message1 = new Message();
        message1.setId(message.getId());
        message1.setSenderId(message.getSenderId());
        message1.setRecipientId(message.getRecipientId());
        message1.setContent(message.getContent());
        message1.setTimestamp(new Date());

       Message savedMessage = messageService.saveMessage(message1);


        messagingTemplate.convertAndSendToUser(
                message.getRecipientId(), "/queue/messages", ChatNotification.builder()
                        .senderId(message.getSenderId())
                        .recipientId(message.getRecipientId())
                        .content(message.getContent())
                        .timestamp(message1.getTimestamp())
                        .build()
        );
    }

    @GetMapping("/message/{senderId}/{recipientId}")
    public ResponseEntity<List<Message>> findChatMessages(
            @PathVariable("senderId") String senderId,
            @PathVariable("recipientId") String recipientId
    ){
        return ResponseEntity.ok(messageService.findMessages(senderId, recipientId));

    }
}
