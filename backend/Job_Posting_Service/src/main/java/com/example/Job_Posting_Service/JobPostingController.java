package com.example.Job_Posting_Service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobPostingController {


    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Spring Boot!";
    }
}

