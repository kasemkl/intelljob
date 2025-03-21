package com.example.QuizApplication.Model.Question;


import com.example.QuizApplication.Model.Quiz;
import com.example.QuizApplication.Model.Views;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "question_type")
public  abstract class Question {

    @Id
    @JsonView(Views.Public.class)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonView(Views.Public.class)
    @Column(name = "qu_text")
    private String text;

    @JsonView(Views.Public.class)
    @Column(name = "qu_point")
    private int point;


    @JsonView(Views.Public.class)
    private int duration;

    @JsonView(Views.Public.class)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

}
