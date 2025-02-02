package com.example.Communication_Service.DTO;

import com.example.Communication_Service.Model.Message;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDTO {
    private String conversationId;
    private String senderId;
    private String recipientId;
    private MessageDTO lastMessage;
}
