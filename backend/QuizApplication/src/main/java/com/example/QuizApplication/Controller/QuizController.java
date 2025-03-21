package com.example.QuizApplication.Controller;

import com.example.QuizApplication.DTO.QuizDTO;
import com.example.QuizApplication.Exception.QuizNotFoundException;
import com.example.QuizApplication.Model.Quiz;
import com.example.QuizApplication.Model.Views;
import com.example.QuizApplication.Service.QuizService;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;
    @JsonView(Views.Admin.class)
    @PostMapping("/create-update")
    public ResponseEntity<String> createQuiz(@RequestBody QuizDTO quizDTO) {
        try {
            // إنشاء أو تحديث الاختبار
            quizService.createOrUpdateQuiz(quizDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Quiz created or updated successfully!");
        } catch (Exception e) {
            // في حال حدوث خطأ، يتم إرسال رسالة فشل مع حالة 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while creating the quiz: " + e.getMessage());
        }
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long quizId) {
        try {
            // محاولة حذف الاختبار
            quizService.deleteQuiz(quizId);
            return ResponseEntity.ok("Quiz and related questions deleted successfully");
        } catch (QuizNotFoundException e) {
            // في حال لم يتم العثور على الاختبار
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Quiz with ID " + quizId + " not found");
        } catch (Exception e) {
            // في حال حدوث خطأ آخر
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while deleting the quiz: " + e.getMessage());
        }
    }
    @JsonView(Views.Public.class)
    @GetMapping("/jobPost/{jobPostId}")
    public ResponseEntity<Quiz> getQuizByJobPost(@PathVariable String jobPostId) {
        Quiz quiz = quizService.getQuizWithoutAnswersByJobPost(jobPostId);
        return ResponseEntity.ok(quiz);
    }



    @JsonView(Views.Admin.class)
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizById(@PathVariable Long quizId) {
        try {
            // استرجاع الاختبار باستخدام ID
            Quiz quiz = quizService.getQuizById(quizId);
            if (quiz == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Quiz with ID " + quizId + " not found");
            }
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            // في حال حدوث خطأ في استرجاع البيانات
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while fetching the quiz: " + e.getMessage());
        }
    }
    @JsonView(Views.Public.class)
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Quiz>> getAllQuizzesByCompanyId(@PathVariable String companyId) {
        List<Quiz> quizzes = quizService.getAllQuizzesByCompanyId(companyId);

        // إذا كانت القائمة فارغة، يمكن إرجاع استجابة "No Content"
        if (quizzes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(quizzes);  // إذا كانت الاختبارات موجودة
    }




}