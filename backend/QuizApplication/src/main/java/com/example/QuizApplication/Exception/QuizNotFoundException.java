package com.example.QuizApplication.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Quiz not found")
public class QuizNotFoundException extends RuntimeException {

    public QuizNotFoundException(Long quizId) {
        super("Quiz not found with ID: " + quizId);
    }
}
