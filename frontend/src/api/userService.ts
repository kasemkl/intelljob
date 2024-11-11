// src/api/userService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Replace with actual User Management Service URL

export const registerUser = (data) =>
  axios.post(`${API_BASE_URL}/users/register/`, data);
export const loginUser = (data) =>
  axios.post(`${API_BASE_URL}/users/login/`, data);
export const fetchUserProfile = (token) =>
  axios.get(`${API_BASE_URL}/users/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateUserProfile = (token, data) =>
  axios.put(`${API_BASE_URL}/users/profile/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
