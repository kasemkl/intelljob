package com.example.QuizApplication.Validation;

import com.example.QuizApplication.Model.Answer.Answer;
import com.example.QuizApplication.Model.Answer.MultipleChoiceAnswer;
import com.example.QuizApplication.Model.Question.Choice;
import com.example.QuizApplication.Model.Question.MCQuestion;
import com.example.QuizApplication.Model.Question.Question;
import com.example.QuizApplication.Service.ChoiceService;
import com.example.QuizApplication.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MultipleChoiceAnswerValidation implements AnswerValidationStrategy {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private ChoiceService choiceService; // لجلب بيانات الاختيارات من قاعدة البيانات


    @Override
    public int validate(Answer answer, Question question) {
        if (answer instanceof MultipleChoiceAnswer mcqAnswer && question instanceof MCQuestion mcQuestion) {

            Set<Choice> correctChoices = mcQuestion.getChoices()
                    .stream()
                    .filter(Choice::isCorrect)
                    .collect(Collectors.toSet());

            List<Choice> selectedChoices = mcqAnswer.getSelectedChoices();

            long correctCount = selectedChoices.stream()
                    .filter(correctChoices::contains)
                    .count();

            // 🟢 حساب النقاط بناءً على نسبة الإجابات الصحيحة
            return (int) ((correctCount / (double) correctChoices.size()) * mcQuestion.getPoint());
        }
        return 0;
    }

}

