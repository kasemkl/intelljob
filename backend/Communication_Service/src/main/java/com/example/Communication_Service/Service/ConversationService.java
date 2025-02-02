package com.example.Communication_Service.Service;

import com.example.Communication_Service.DAO.ConversationRepo;
import com.example.Communication_Service.DAO.MessageRepo;
import com.example.Communication_Service.DTO.ConversationDTO;
import com.example.Communication_Service.DTO.MessageDTO;
import com.example.Communication_Service.Model.Conversation;
import com.example.Communication_Service.Model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConversationService {

    @Autowired
    private  ConversationRepo conversationRepo;

    @Autowired
    private MessageRepo messageRepo;

    public Optional<String> getConversationId(
            String senderId,
            String recipientId,
            boolean createNewConversationIfNotExists
    )
    {
        return conversationRepo.findBySenderIdAndRecipientId(senderId,recipientId)
                .map(Conversation::getChatId)
                .or(()-> {
                    if (createNewConversationIfNotExists){
                        var chatId= createConversationId(senderId,recipientId);

                        return Optional.of(chatId.toString());
                    }
                    return Optional.empty();
                });
    }


    public List<ConversationDTO> getUserConversations(String userId) {
        List<Conversation> conversations = conversationRepo.findBySenderIdOrRecipientId(userId, userId);
        List<ConversationDTO> result = new ArrayList<>();


        for (Conversation conversation : conversations) {

            if (conversation.getSenderId().equals(userId)) {
                continue;
            }
            // جلب آخر رسالة
            Message lastMessage = messageRepo.findLastMessageByChatId(conversation.getChatId());

            MessageDTO filteredMessage = new MessageDTO();
            filteredMessage.setContent(lastMessage.getContent());
            filteredMessage.setTimestamp(lastMessage.getTimestamp());
            filteredMessage.setSenderId(lastMessage.getSenderId());

            //  تعبئة بيانات المحادثة في DTO
            ConversationDTO dto = new ConversationDTO(
                    conversation.getId(),
                    conversation.getSenderId(),
                    conversation.getRecipientId(),
                    filteredMessage
            );

            result.add(dto);
        }


        return result;
    }

private Object createConversationId(String senderId, String recipientId) {
    var chatId = String.format("%s_%s",senderId,recipientId);
    Conversation senderRecipient = Conversation.builder()
            .chatId(chatId)
            .senderId(senderId)
            .recipientId(recipientId)
            .build();

    Conversation recipientSender = Conversation.builder()
            .chatId(chatId)
            .senderId(recipientId)
            .recipientId(senderId)
            .build();

    conversationRepo.save(senderRecipient);
    conversationRepo.save(recipientSender);
    return chatId;
}
}
