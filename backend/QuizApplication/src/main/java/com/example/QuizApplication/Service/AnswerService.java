package com.example.QuizApplication.Service;

import com.example.QuizApplication.DAO.QuizRepository;
import com.example.QuizApplication.DTO.Answer.AnswerRequestDTO;
import com.example.QuizApplication.DAO.AnswerRepository;
import com.example.QuizApplication.Model.Answer.Answer;
import com.example.QuizApplication.Model.Answer.MultipleChoiceAnswer;
import com.example.QuizApplication.Model.Answer.TrueFalseAnswer;
import com.example.QuizApplication.Model.Question.Choice;
import com.example.QuizApplication.Model.Question.MCQuestion;
import com.example.QuizApplication.Model.Question.Question;
import com.example.QuizApplication.Model.Quiz;
import com.example.QuizApplication.Validation.AnswerValidationStrategy;
import com.example.QuizApplication.Validation.MultipleChoiceAnswerValidation;
import com.example.QuizApplication.Validation.TrueFalseAnswerValidation;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnswerService {

    @Autowired
    private  AnswerRepository answerRepository;

    @Autowired
    private QuizService quizService;

    @Autowired
    private  QuestionService questionService;  // للحصول على السؤال والخيارات في حالة MultipleChoice

   @Autowired
   private ChoiceService choiceService;

    private Map<Class<? extends Answer>, AnswerValidationStrategy> strategyMap;

    @PostConstruct
    public void init() {
        strategyMap = new HashMap<>();
        strategyMap.put(TrueFalseAnswer.class, new TrueFalseAnswerValidation());
        strategyMap.put(MultipleChoiceAnswer.class, new MultipleChoiceAnswerValidation());
    }
    @Transactional
    public Float processAnswers(AnswerRequestDTO answerRequestDTO) {

        for (AnswerRequestDTO.AnswerData answerData : answerRequestDTO.getAnswers()) {

            Question question = questionService.getOpQuestionById(answerData.getQuestionId())
                    .orElseThrow(() -> new IllegalArgumentException("Question not found"));

            Answer answer = createAnswer(answerData,question);
                answer.setQuestion(question);
                answer.setJobApplicationId(answerRequestDTO.getJobApplicationId());

            int score = evaluateAnswer(answer,question);
            answer.setScore(score);

            saveAnswer(answer);
              }
        return calculateScorePercentage(answerRequestDTO.getJobApplicationId(), answerRequestDTO.getQuizId());

    }

    // إنشاء الإجابة بناءً على الـ answerType
    private Answer createAnswer(AnswerRequestDTO.AnswerData answerData,Question question) {


        return switch (answerData.getAnswerType()) {
            case TRUE_FALSE -> new TrueFalseAnswer(answerData.getAnswerUser());
            case MULTIPLE_CHOICE ->createMultipleChoiceAnswer(question,answerData.getSelectedChoices());
            default -> throw new IllegalArgumentException("Invalid answer type");
        };
    }

    private MultipleChoiceAnswer createMultipleChoiceAnswer(Question question, List<Long> choiceIds) {

        List<Choice> selectedChoices = getChoicesByIds(choiceIds);

        return new MultipleChoiceAnswer(selectedChoices);
    }
    private List<Choice> getChoicesByIds(List<Long> choiceIds) {
        return choiceService.getChoicesByIds(choiceIds);  // استدعاء الخدمة لجلب الخيارات بناءً على الـ IDs
    }



    // استخدام استراتيجية التحقق
    private int evaluateAnswer(Answer answer,Question question) {
        AnswerValidationStrategy strategy = strategyMap.get(answer.getClass());
        return strategy != null ? strategy.validate(answer,question) : 0;
    }

    // حفظ الإجابة في قاعدة البيانات
    public void saveAnswer(Answer answer) {
        answerRepository.save(answer);
    }

    // حساب الدرجة الإجمالية

    public float calculateScorePercentage(String jobApplicationId, long quizId) {
        Quiz quiz = quizService.getQuizById(quizId);
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz with ID " + quizId + " not found.");
        }

        List<Answer> answers = answerRepository.findByJobApplicationId(jobApplicationId);
        if (answers.isEmpty()) {
            return 0.0f;
        }

        int userScore = answers.stream().mapToInt(Answer::getScore).sum();
        int totalScore = quiz.getTotalScore();
        if (totalScore <= 0) {
            return 0.0f;
        }

        return (float) Math.round(((float) userScore / totalScore) * 100 * 100) / 100;

    }

    public int calculateTotalScore(String jobApplicationId) {
        // استرجاع الإجابات الخاصة بطلب التوظيف والاختبار المحدد
        List<Answer> answers = answerRepository.findByJobApplicationId(jobApplicationId);
        // جمع النقاط مباشرة من حقل score لكل إجابة
        return answers.stream()
                .mapToInt(Answer::getScore)
                .sum();
    }

}
