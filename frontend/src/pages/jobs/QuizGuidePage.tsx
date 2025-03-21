import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MDBContainer, MDBCard, MDBCardBody, MDBBtn } from "mdb-react-ui-kit";

const QuizGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const {applicationId}=useParams<{ applicationId: string }>();
  const handleStartQuiz = () => {
    navigate(`/jobs/${jobId}/quiz/${applicationId}`);
  };

  return (
    <MDBContainer className="py-5">
      <MDBCard>
        <MDBCardBody>
          <h2 className="mb-4">Quiz Instructions</h2>
          <p>
            Please read the following instructions carefully before starting the
            quiz:
          </p>
          <ul>
            <li>Each question will be displayed one at a time with a timer.</li>
            <li>
              If the timer runs out, you will automatically move to the next
              question.
            </li>
            <li>You cannot retake the quiz if you lose the session.</li>
          </ul>
          <MDBBtn onClick={handleStartQuiz}>Start Quiz</MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default QuizGuidePage;
