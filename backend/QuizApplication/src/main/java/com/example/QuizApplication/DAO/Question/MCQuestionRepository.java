package com.example.QuizApplication.DAO.Question;

import com.example.QuizApplication.Model.Question.MCQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MCQuestionRepository  extends JpaRepository<MCQuestion, Long> {
}
