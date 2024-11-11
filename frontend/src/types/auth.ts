export interface DecodedUser {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "job_seeker" | "company" | "admin";
}
