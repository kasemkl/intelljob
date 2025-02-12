import jobApi from "./api/jobApi";

export interface JobRequirement {
  description: string;
}

export interface JobCategory {
  id: number;
  name?: string;
}

export interface JobData {
  id: number;
  companyId: number;
  description: string;
  locationId: number;
  location: string;
  status: string;
  salaryRange: string;
  createdAt: string;
  updatedAt: string | null;
  title: string;
  postDate: string;
  requirements: JobRequirement[];
  categories: JobCategory[];
  jobType: string;
}

export const jobService = {
  getAllJobs: () => jobApi.get<JobData[]>("/"),

  getJob: (id: number) => jobApi.get<JobData>(`/${id}`),

  createJob: (jobData: Omit<JobData, "id" | "createdAt" | "updatedAt">) =>
    jobApi.post("/", jobData),

  updateJob: async (id: number, jobData: any) => {
    return await jobApi.put(`/${id}/`, jobData);
  },

  deleteJob: (id: number) => jobApi.delete(`/${id}`),

  getByLocationId: (id: number) => jobApi.get<JobData[]>(`/location/${id}`),

  getByCompanyId: (id: number) => jobApi.get<JobData[]>(`/company/${id}`),

  getByCategory: (id: number) => jobApi.get<JobData[]>(`/category/${id}`),
};
