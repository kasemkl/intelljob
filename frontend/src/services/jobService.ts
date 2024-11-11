import axios from "axios";
import { Job } from "../types/job";

const API_URL = "http://localhost:8001/api";

export const jobService = {
  getAllJobs: () => axios.get<Job[]>(`${API_URL}/jobs/`),

  getJob: (id: number) => axios.get<Job>(`${API_URL}/jobs/${id}/`),

  createJob: (jobData: Partial<Job>) =>
    axios.post<Job>(`${API_URL}/jobs/`, jobData),

  updateJob: (id: number, jobData: Partial<Job>) =>
    axios.put<Job>(`${API_URL}/jobs/${id}/`, jobData),

  deleteJob: (id: number) => axios.delete(`${API_URL}/jobs/${id}/`),
};
