import applicationApi from "./api/applicationApi";

export interface Skill {
  name: string;
  level: number;
}

export interface Experience {
  position: string;
  company: string;
  years: number;
  description: string;
  start_date: string;
  end_date: string;
}

export interface Education {
  institution: string;
  degree: string;
  start_date: string;
  end_date: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Certification {
  name: string;
  date_obtained: string;
}

export interface JobSeekerDetails {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
  certifications: Certification[];
  linkedin_url: string | null;
  awards: any[];
  companies_worked_at: any[];
}

export interface JobDetails {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: string;
}

export interface Application {
  id: number;
  job_id: number;
  job_seeker_id: number;
  status: string;
  applied_at: string;
  job_seeker_details: JobSeekerDetails;
  job_details: JobDetails;
}

export const useApplicationService = () => {
  return {
    applyForJob: async (
      jobId: number,
      userId: number,
      similarity_score: number
    ) => {
      return await applicationApi.post("/apply/", {
        job_id: jobId,
        job_seeker_id: userId,
        similarity_score: similarity_score,
      });
    },

    getUserApplications: async (userId: number) => {
      return await applicationApi.get<Application[]>(`/job-seeker/${userId}/`);
    },

    getCompanyApplications: async (jobId: number) => {
      return await applicationApi.get<Application[]>(`/job/${jobId}/`);
    },

    updateApplicationStatus: async (applicationId: number, status: string) => {
      return await applicationApi.put(`/${applicationId}/update/`, {
        status,
      });
    },

    getApplicationStatus: async (applicationId: number, userId: number) => {
      return await applicationApi.get(`/${applicationId}/`, {
        data: { job_seeker_id: userId },
      });
    },

    getApplicationDetails: (applicationId: number) => {
      return applicationApi.get(`/${applicationId}`);
    },
  };
};
