package com.example.QuizApplication.DAO.Question;

import com.example.QuizApplication.Model.Question.BinaryQuestion;
import com.example.QuizApplication.Model.Question.Question;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Question q WHERE q.quiz.id = :quizId")
    void deleteByQuizId(@Param("quizId") Long quizId);

    @Query("SELECT q FROM Question q WHERE q.id = :id AND TYPE(q) = BinaryQuestion")
    Optional<BinaryQuestion> findBinaryQuestionById(@Param("id") Long id);

}
