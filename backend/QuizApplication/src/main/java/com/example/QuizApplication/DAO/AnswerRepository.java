package com.example.QuizApplication.DAO;

import com.example.QuizApplication.Model.Answer.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByJobApplicationId(String jobApplicationId);
}
