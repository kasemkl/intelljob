package com.example.QuizApplication.Factory;

import com.example.QuizApplication.Model.Question.BinaryQuestion;
import com.example.QuizApplication.Model.Question.MCQuestion;
import com.example.QuizApplication.Model.Question.Question;
import org.springframework.stereotype.Component;

@Component
public class QuestionFactory {
    public Question createQuestion(String questionType) {
        switch (questionType) {
            case "MULTIPLE_CHOICE":
                return new MCQuestion();
            case "TRUE_FALSE":
                return new BinaryQuestion();
            default:
                throw new IllegalArgumentException("Unknown question type");
        }
    }
}
