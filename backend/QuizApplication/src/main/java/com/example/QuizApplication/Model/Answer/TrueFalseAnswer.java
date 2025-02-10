package com.example.QuizApplication.Model.Answer;

import com.example.QuizApplication.Model.Question.BinaryQuestion;
import com.example.QuizApplication.Model.Question.Question;
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
@DiscriminatorValue("TRUE_FALSE")
public class TrueFalseAnswer extends Answer {

    private Boolean userAnswer;



    public TrueFalseAnswer(boolean userAnswer){
        this.userAnswer =userAnswer;
    }


    @Override
    public void validate() {
        if (userAnswer == null) {
            throw new IllegalArgumentException("the answer should be selected!!");
        }
    }

}
