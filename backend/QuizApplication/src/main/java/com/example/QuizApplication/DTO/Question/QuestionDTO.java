package com.example.QuizApplication.DTO.Question;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuestionDTO {


    private String text;
    private int point;
    private String questionType;
    private Boolean trueAnswer;
    private List<ChoiceDTO> choices;

}


