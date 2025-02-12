import { API_CONFIG } from "./api/config";
import axios from "axios";
import { getAuthHeader } from "./api/config";

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "job_seeker" | "company" | "admin";
  profile_picture?: string;
}

export interface CompanyProfile {
  id: number;
  user: number;
  profile_id: string;
  industry: string;
  company_size: number;
  location_id: number | null;
}

const userApi = axios.create({
  baseURL: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.users}`,
});

userApi.interceptors.request.use(
  (config) => {
    const headers = getAuthHeader();
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userService = {
  getUserProfile: (userId: number) => userApi.get<UserProfile>(`/${userId}`),

  updateUserProfile: (userId: number, data: Partial<UserProfile>) =>
    userApi.put<UserProfile>(`/${userId}`, data),

  getCompanyProfile: (userId: number) =>
    userApi.get<CompanyProfile>(`/companies/user/${userId}`),

  updateCompanyProfile: (userId: number, data: Partial<CompanyProfile>) =>
    userApi.put<CompanyProfile>(`/companies/${userId}`, data),

  changePassword: (
    userId: number,
    data: { old_password: string; new_password: string }
  ) => userApi.put(`/change-password/${userId}`, data),
};
