package com.example.Communication_Service.Model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Conversation   {

    @Id
    private String id;
    private String chatId;
    private String senderId;
    private String recipientId;

}
