package com.example.QuizApplication.Model.Question;

import com.example.QuizApplication.Model.Views;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("MULTIPLE_CHOICE")
public class MCQuestion extends Question {

    @JsonView(Views.Public.class)  // متاح للجميع
    @OneToMany(mappedBy = "question")
    private List<Choice> choices;
}
