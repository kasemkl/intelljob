package com.example.Communication_Service.DTO;

import lombok.Getter;
import lombok.Setter;


import java.util.Date;
@Getter
@Setter
public class MessageDTO {

    private String senderId;
    private String content;
    private Date timestamp;
}
