package com.example.QuizApplication.Model.Question;

import com.example.QuizApplication.Model.Views;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Entity
@DiscriminatorValue("BINARY_QUESTION")
public class BinaryQuestion extends Question {
    @JsonView(Views.Admin.class)
    private boolean trueAnswer;
}
