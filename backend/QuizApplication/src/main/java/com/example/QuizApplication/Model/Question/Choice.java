package com.example.QuizApplication.Model.Question;

import com.example.QuizApplication.Model.Views;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "choice")
public class Choice {

    @Id
    @JsonView(Views.Public.class)  // متاح للجميع
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonView(Views.Public.class)  // متاح للجميع
    private String text;

    @JsonView(Views.Admin.class)
    private boolean isCorrect;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mc_question_id", nullable = false)  // اسم العمود الذي يربط الخيار بالسؤال
    private Question question;
}
