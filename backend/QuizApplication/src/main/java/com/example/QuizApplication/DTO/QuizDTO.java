package com.example.QuizApplication.DTO;

import com.example.QuizApplication.DTO.Question.QuestionDTO;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class QuizDTO {
    private long id;
    private String title;
    private String description;
    private String JobPostId; //fk
    private String companyId;
    private int duration;

    private List<QuestionDTO> questions;

}