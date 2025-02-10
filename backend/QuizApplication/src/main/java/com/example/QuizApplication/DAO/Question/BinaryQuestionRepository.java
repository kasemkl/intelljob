package com.example.QuizApplication.DAO.Question;

import com.example.QuizApplication.Model.Question.BinaryQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BinaryQuestionRepository extends JpaRepository<BinaryQuestion,Long> {
    BinaryQuestion findById(long id);
}
