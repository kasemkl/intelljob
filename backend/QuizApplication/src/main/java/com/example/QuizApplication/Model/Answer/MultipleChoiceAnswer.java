package com.example.QuizApplication.Model.Answer;

import com.example.QuizApplication.Model.Question.Choice;
import com.example.QuizApplication.Model.Question.MCQuestion;
import com.example.QuizApplication.Model.Question.Question;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Setter
@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("MULTIPLE_CHOICE")
public class MultipleChoiceAnswer extends Answer{
    @ManyToMany
    @JoinTable(
            name = "mcq_answer_choices",
            joinColumns = @JoinColumn(name = "mcq_answer_id"),
            inverseJoinColumns = @JoinColumn(name = "choice_id")
    )
    private List<Choice> selectedChoices;






    @Override
    public void validate() {
        if (selectedChoices == null || selectedChoices.isEmpty()) {
            throw new IllegalArgumentException("At least one choice must be selected!");
        }
    }
}
