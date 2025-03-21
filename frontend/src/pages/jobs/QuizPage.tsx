import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBSpinner,
  MDBProgress,
  MDBProgressBar,
} from "mdb-react-ui-kit";
import { quizService } from "../../services/quizService";
import { toast } from "react-toastify";
import "./QuizPage.css"; // Custom CSS for additional styling
import { useApplicationService } from "../../services/applicationService";

const QuizPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({});
  const [quizId, setQuizId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const {applicationId}=useParams<{ applicationId: string }>();
  // Retrieve the application ID from the location state
  const applicationService = useApplicationService();
console.log(applicationId)
  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setTimeLeft(questions[currentQuestionIndex].duration);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Automatically move to the next question when time runs out
      moveToNextQuestion();
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const response = await quizService.getQuizByJobId(Number(jobId));
      setQuestions(response.questions);
      setQuizId(response.id);
    } catch (error) {
      toast.error("Failed to load quiz");
      console.error("Error loading quiz:", error);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleAnswerChange = (choiceId: number) => {
    if (timeLeft > 0) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestionIndex].id]: choiceId,
      }));
    }
  };

  const handleSubmit = async () => {
    if(quizId === 0)
      return
    try {
      const formattedAnswers = Object.entries(answers)
        .map(([questionId, choiceId]) => {
          const question = questions.find((q) => q.id === parseInt(questionId));
          if (!question) return null;

          const answerType =
            question.choices.length > 2 ? "MULTIPLE_CHOICE" : "TRUE_FALSE";
          const isTrueFalse = answerType === "TRUE_FALSE";
          const isMultipleChoice = answerType === "MULTIPLE_CHOICE";

          return {
            questionId: parseInt(questionId),
            answerType: answerType,
            answerUser: isTrueFalse ? choiceId === 1 : undefined,
            selectedChoices: isMultipleChoice ? [choiceId] : undefined,
          };
        })
        .filter((answer) => answer !== null);

      const response = await quizService.submitAnswers({
        jobApplicationId: applicationId, // Use the application ID
        quizId: quizId,
        answers: formattedAnswers,
      });
console.log(response)
      const scorePercentage = response.scorePercentage; // Implement this function to calculate score

      // Update quiz score in the application
      const response2 =await applicationService.updateApplication(applicationId,scorePercentage);

      toast.success("Quiz submitted successfully");
      navigate("/jobs");
    } catch (error) {
      toast.error("Failed to submit quiz");
      console.error("Error submitting quiz:", error);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <MDBSpinner />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <MDBContainer className="py-5">
      <MDBCard className="shadow-lg quiz-card">
        <MDBCardBody>
          <h2 className="mb-4 text-center">Quiz</h2>
          <h5 className="question-text">{currentQuestion.text}</h5>
          <MDBProgress className="my-3">
            <MDBProgressBar
              width={(timeLeft / currentQuestion.duration) * 100}
              valuemin={0}
              valuemax={currentQuestion.duration}
            />
          </MDBProgress>
          <div className="time-left">Time left: {timeLeft} seconds</div>
          {currentQuestion.choices.map((choice: any) => (
            <div key={choice.id} className="choice-item">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={choice.id}
                onChange={() => handleAnswerChange(choice.id)}
                disabled={timeLeft === 0}
              />
              {choice.text}
            </div>
          ))}
          <div className="text-end">
            <MDBBtn onClick={moveToNextQuestion} className="mt-3" type="button">
              Next
            </MDBBtn>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default QuizPage;
