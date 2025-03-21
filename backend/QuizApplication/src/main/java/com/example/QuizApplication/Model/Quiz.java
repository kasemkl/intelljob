package com.example.QuizApplication.Model;

import com.example.QuizApplication.Model.Question.Question;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quiz")
public class Quiz {


    @Id
    @JsonView(Views.Public.class)  // متاح للجميع
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonView(Views.Public.class)
    private String title;

    @JsonView(Views.Public.class)
    private String description;

    @JsonView(Views.Public.class)
    private String companyId;

    @JsonView(Views.Public.class)
    @Column(nullable = false, unique = true)
    private String jobPostId; //fk

    @JsonView(Views.Public.class)
    private int totalScore = 0;

    @JsonView(Views.Public.class)
    private int duration;

    @JsonView(Views.Public.class)
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    public void addQuestion(Question question) {
        if (this.questions == null) {
            this.questions = new ArrayList<>();
        }
        this.questions.add(question);
        question.setQuiz(this); // تأكد من ضبط العلاقة الثنائية
    }


    public void updateTotalScore() {
        this.totalScore = questions.stream().mapToInt(Question::getPoint).sum();
    }


}
