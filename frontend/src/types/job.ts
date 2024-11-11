// Job model based on backend structure
export interface Job {
  id: number; // Unique identifier for the job
  title: string; // Job title
  description: string; // Job description
  requirements: string; // Job requirements
  salary: number; // Salary range
  company_id: number; // ID of the company offering the job
  company_name: string; // Name of the company offering the job
  location_id: number; // ID of the location (referencing the Location model)
  location_name: string; // Name of the location
  posted_date: string; // Date of job posting creation
}
