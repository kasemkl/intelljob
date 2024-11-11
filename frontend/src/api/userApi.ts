import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Replace with actual User Management service URL

export const getUsers = () => axios.get(`${API_URL}/users`);
export const getUserById = (id: string) => axios.get(`${API_URL}/users/${id}`);
export const createUser = (data: any) => axios.post(`${API_URL}/users`, data);
export const updateUser = (id: string, data: any) =>
  axios.put(`${API_URL}/users/${id}`, data);
export const deleteUser = (id: string) =>
  axios.delete(`${API_URL}/users/${id}`);
export const changePassword = (id: string, password: string) =>
  axios.put(`${API_URL}/users/${id}/change-password`, { password });
