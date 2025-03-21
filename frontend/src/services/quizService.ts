import axios from "axios";

const API_BASE_URL = "http://localhost:8081";

export const quizService = {
  getQuizByJobId: async (jobPostId: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/quiz/jobPost/${jobPostId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching quiz:", error);
      throw error;
    }
  },

  createOrUpdateQuiz: async (quizData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/quiz/create-update`,
        quizData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating or updating quiz:", error);
      throw error;
    }
  },

  submitAnswers: async (answersData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/answers/submit`,
        answersData
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting answers:", error);
      throw error;
    }
  },
};
