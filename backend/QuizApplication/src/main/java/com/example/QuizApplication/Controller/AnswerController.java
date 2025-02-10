package com.example.QuizApplication.Controller;

import com.example.QuizApplication.DTO.Answer.AnswerRequestDTO;
import com.example.QuizApplication.Model.Answer.Answer;
import com.example.QuizApplication.Model.Answer.TrueFalseAnswer;
import com.example.QuizApplication.Service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/answers")
@RequiredArgsConstructor
public class AnswerController {
    @Autowired
    private AnswerService answerService;

    // ✅ استقبال قائمة الإجابات وحفظها

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitAnswers(@RequestBody AnswerRequestDTO answerRequestDTO) {
        try {
            float scorePercentage = answerService.processAnswers(answerRequestDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Answers submitted successfully");
            response.put("scorePercentage", scorePercentage);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    // ✅ حساب النتيجة الإجمالية بناءً على jobApplicationId و quizId

    @GetMapping("/score/{jobApplicationId}")
    public ResponseEntity<Integer> getTotalScore(@PathVariable String jobApplicationId) {
        int score = answerService.calculateTotalScore(jobApplicationId);
        return ResponseEntity.ok(score);
    }



}

