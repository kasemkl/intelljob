package com.example.Communication_Service.DTO;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class ChatNotification {



    private String senderId;
    private String recipientId;
    private String content;
    private Date timestamp;
}
