package com.example.QuizApplication.Model.Answer;

import com.example.QuizApplication.Model.Question.Question;
import com.example.QuizApplication.Model.Quiz;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.awt.*;
import java.util.ArrayList;
/*
@Table(name = "answers", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"jobApplicationId", "question_id"})
})*/
@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "answer_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobApplicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    private int score;

    public abstract void validate();

}

