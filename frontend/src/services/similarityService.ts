import axios from "axios";
import cvParsingApi from "./api/cvParsingApi";

export const calculateSimilarity = async (
  jobSeekerEmbedding: string,
  jobEmbedding: string
) => {
  try {
    const response = await cvParsingApi.post("/api/calculate-similarity/", {
      jobSeeker_embedding: jobSeekerEmbedding,
      job_embedding: jobEmbedding,
    });
    return response.data;
  } catch (error) {
    console.error("Error calculating similarity:", error);
    throw error;
  }
};
