package com.example.QuizApplication.DAO.Question;

import com.example.QuizApplication.Model.Question.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Long> {
    List<Choice> findByQuestionIdAndIsCorrectTrue(Long questionId);
}
