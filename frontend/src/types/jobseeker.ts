export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "job_seeker" | "company" | "admin";
}

export interface Skill {
  id?: number;
  name: string;
  level: number;
}

export interface Experience {
  id?: number;
  position: string;
  company: string;
  years: number;
  start_date: string;
  end_date: string;
  description: string;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string;
}

export interface JobSeekerProfile {
  user: number;
  profile_id: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}
