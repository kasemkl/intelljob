package com.example.QuizApplication.DTO.Answer;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
public class AnswerRequestDTO {
    private String jobApplicationId;  // معرف طلب الوظيفة
    private Long quizId;              // معرف الاختبار
    private List<AnswerData> answers; // قائمة بالإجابات

    @Data
    public static class AnswerData {
        private Long questionId;             // معرف السؤال
        private AnswerType answerType;       // نوع الإجابة
        private String answerText;           // الإجابة النصية (للنصوص المفتوحة)
        private Boolean answerUser;          // إجابة المستخدم (لصح/خطأ)
        private List<Long> selectedChoices;  // قائمة معرفات الاختيارات المحددة (لمتعدد الخيارات)



    }

    public enum AnswerType {
        TEXT, TRUE_FALSE, MULTIPLE_CHOICE
    }

}
