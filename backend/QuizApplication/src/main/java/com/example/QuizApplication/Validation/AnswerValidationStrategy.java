package com.example.QuizApplication.Validation;

import com.example.QuizApplication.Model.Answer.Answer;
import com.example.QuizApplication.Model.Question.Question;
import org.springframework.stereotype.Component;


public interface AnswerValidationStrategy {


        int validate(Answer answer, Question question);

}
