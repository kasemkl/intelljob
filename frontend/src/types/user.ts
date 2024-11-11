// User model based on backend structure
export interface User {
  id: number; // Unique identifier for the user
  email: string; // User's email address
  password?: string; // User's password (optional for certain operations)
  firstName?: string; // Optional first name
  lastName?: string; // Optional last name
  role: "jobSeeker" | "company" | "admin"; // User roles
  createdAt: string; // Date of account creation
  updatedAt: string; // Date of last update
}
