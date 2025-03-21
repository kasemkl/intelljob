package com.example.QuizApplication.Service;

import com.example.QuizApplication.DAO.Question.QuestionRepository;
import com.example.QuizApplication.DAO.QuizRepository;
import com.example.QuizApplication.DTO.*;
import com.example.QuizApplication.DTO.Question.QuestionDTO;
import com.example.QuizApplication.Factory.QuestionFactory;
import com.example.QuizApplication.Model.Question.Question;
import com.example.QuizApplication.Model.Quiz;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    @Autowired
    QuizRepository quizRepository;

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    QuestionService questionService;

    @Autowired
    QuestionFactory questionFactory;

    @Transactional
    public void createOrUpdateQuiz(QuizDTO incomingQuiz) {
        Quiz quiz = quizRepository.findById(incomingQuiz.getId())
                .orElse(new Quiz());  // إذا لم يتم العثور على الاختبار، يتم إنشاؤه جديدًا

        quiz.setTitle(incomingQuiz.getTitle());
        quiz.setCompanyId(incomingQuiz.getCompanyId());
        quiz.setDescription(incomingQuiz.getDescription());
        quiz.setJobPostId(incomingQuiz.getJobPostId());
        quiz.setDuration(incomingQuiz.getDuration());

        quizRepository.save(quiz);


        questionRepository.deleteByQuizId(quiz.getId());

        // save Questions and Choices using Factory
        for (QuestionDTO questionDTO : incomingQuiz.getQuestions()) {
            Question question = questionFactory.createQuestion(questionDTO.getQuestionType());
            question.setText(questionDTO.getText());
            question.setPoint(questionDTO.getPoint());
            question.setQuiz(quiz);
            question.setDuration(questionDTO.getDuration());


            questionRepository.save(question);

            // إذا كان السؤال من نوع "MULTIPLE_CHOICE"
            if ("MULTIPLE_CHOICE".equals(questionDTO.getQuestionType())) {
                questionService.saveChoices(questionDTO.getChoices(), question);
            }

            // إذا كان السؤال من نوع "TRUE_FALSE"
            if ("TRUE_FALSE".equals(questionDTO.getQuestionType())) {
                questionService.saveTrueFalseAnswer(question, questionDTO.getTrueAnswer());
            }
            quiz.addQuestion(question);
        }
        quiz.updateTotalScore();
        quizRepository.save(quiz);
    }

    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }


    public void deleteQuiz(Long quizId) {
        // حذف جميع الأسئلة والاختيارات المرتبطة بالاختبار
        questionRepository.deleteByQuizId(quizId);

        // حذف الاختبار بعد حذف الأسئلة
        quizRepository.deleteById(quizId);
    }

    public List<Quiz> getAllQuizzesByCompanyId(String companyId) {
        // استعلام للحصول على جميع الاختبارات المرتبطة بالشركة
        return quizRepository.findByCompanyId(companyId);
    }


    public Quiz getQuizWithoutAnswersByJobPost(String jobPostId) {
        return quizRepository.findByJobPostId(jobPostId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }
}




