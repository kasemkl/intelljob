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

export interface CVParseResponse {
  name: string | null;
  email: string | null;
  location: string | null;
  linkedIn_Link: string | null;
  university: string[];
  skills: string[];
  degree: string[];
  language: string[];
  certification: string[];
  worked_as: string[];
  year_of_experience: string[];
  year_of_graduation: string[];
  awards: string[];
  companies_work_at: string[];
}

export interface JobSeekerProfile {
  user: number;
  profile_id: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  linkedin_url?: string;
  languages: Language[];
  certifications: Certification[];
  awards: string[];
  companies_worked_at: string[];
}

export interface Language {
  id?: number;
  name: string;
  proficiency: string;
}

export interface Certification {
  id?: number;
  name: string;
  date_obtained?: string;
}
