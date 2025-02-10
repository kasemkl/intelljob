package com.example.QuizApplication.Validation;


import com.example.QuizApplication.DAO.Question.BinaryQuestionRepository;
import com.example.QuizApplication.DAO.Question.QuestionRepository;
import com.example.QuizApplication.Model.Answer.Answer;

import com.example.QuizApplication.Model.Answer.TrueFalseAnswer;
import com.example.QuizApplication.Model.Question.BinaryQuestion;
import com.example.QuizApplication.Model.Question.MCQuestion;
import com.example.QuizApplication.Model.Question.Question;
import com.example.QuizApplication.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class TrueFalseAnswerValidation implements AnswerValidationStrategy{

    @Autowired
    QuestionService questionService;
    @Override
    public int validate(Answer answer, Question question) {
        if (answer instanceof TrueFalseAnswer trueFalseAnswer && question instanceof BinaryQuestion binaryQuestion) {

            // 🟢 التأكد من عدم وجود قيم فارغة قبل المتابعة
            boolean correctAnswer = binaryQuestion.isTrueAnswer();

            return trueFalseAnswer.getUserAnswer() == correctAnswer ? binaryQuestion.getPoint() : 0;
        }
        return 0;
    }

}
