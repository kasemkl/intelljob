package com.example.QuizApplication.Service;

import com.example.QuizApplication.DAO.Question.ChoiceRepository;
import com.example.QuizApplication.Model.Question.Choice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChoiceService {
    @Autowired
    private ChoiceRepository choiceRepository;
    public List<Choice> getCorrectChoicesByQuestionId(Long questionId) {
        return choiceRepository.findByQuestionIdAndIsCorrectTrue(questionId);
    }


    public List<Choice> getChoicesByIds(List<Long> choiceIds) {
        return choiceRepository.findAllById(choiceIds);
    }
}
