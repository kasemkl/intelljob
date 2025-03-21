package com.example.Communication_Service.Controller;

import com.example.Communication_Service.DTO.ConversationDTO;
import com.example.Communication_Service.Service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/conversations")
public class ConversationController {



    @Autowired
    private ConversationService conversationService;

    @GetMapping("/{userId}")
    public List<ConversationDTO> getUserConversations(@PathVariable String userId) {
        return conversationService.getUserConversations(userId);
    }
}
