package com.example.QuizApplication.DTO.Question;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChoiceDTO {
    private String text;
    private Boolean isCorrect;

}
