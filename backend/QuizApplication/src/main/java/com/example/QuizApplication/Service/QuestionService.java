package com.example.QuizApplication.Service;

import com.example.QuizApplication.DAO.Question.BinaryQuestionRepository;
import com.example.QuizApplication.DAO.Question.ChoiceRepository;
import com.example.QuizApplication.DAO.Question.QuestionRepository;
import com.example.QuizApplication.DAO.QuizRepository;
import com.example.QuizApplication.DTO.Question.ChoiceDTO;
import com.example.QuizApplication.Model.Question.BinaryQuestion;
import com.example.QuizApplication.Model.Question.Choice;
import com.example.QuizApplication.Model.Question.Question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

   // @Autowired
  //  BinaryQuestionRepository binaryQuestionRepository;

   // @Autowired
   // QuizRepository quizRepository;
    @Autowired
    private ChoiceRepository choiceRepository;

    // حفظ الخيارات للأسئلة من نوع MULTIPLE_CHOICE
    public void saveChoices(List<ChoiceDTO> choices, Question question) {
        for (ChoiceDTO choiceDTO : choices) {
            Choice choice = new Choice();
            choice.setText(choiceDTO.getText());
            choice.setCorrect(choiceDTO.getIsCorrect());
            choice.setQuestion(question);
            choiceRepository.save(choice);
        }
    }


    public Optional<BinaryQuestion> getBinaryQuestionById(Long id) {
        return questionRepository.findBinaryQuestionById(id);
    }

        public Question getQuestionById(Long questionId) {
            return questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found!"));
        }
    public Optional<Question> getOpQuestionById(Long questionId) {
        return questionRepository.findById(questionId);
    }


    // تعيين الإجابة الصحيحة للأسئلة من نوع TRUE_FALSE
    public void saveTrueFalseAnswer(Question question, boolean trueAnswer) {
        if (question instanceof BinaryQuestion) {
            BinaryQuestion binaryQuestion = (BinaryQuestion) question;
            binaryQuestion.setTrueAnswer(trueAnswer);
            questionRepository.save(binaryQuestion);
        }
    }


}
