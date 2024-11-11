import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const baseURL = "http://127.0.0.1:8000";

interface AxiosError {
  response?: {
    status: number;
    data: any;
  };
  config?: any;
}

const useAxios = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAxios must be used within an AuthProvider");
  }

  const { authTokens, setUser, setAuthTokens } = auth;

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens?.access) {
      return req;
    }

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp || 0).diff(dayjs()) < 1;

    if (!isExpired) {
      return req;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/users-management/token/refresh/`,
        {
          refresh: authTokens.refresh,
        }
      );

      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));

      if (req.headers) {
        req.headers.Authorization = `Bearer ${response.data.access}`;
      }

      return req;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("authTokens");
      window.location.href = "/login";
      throw error;
    }
  });

  return axiosInstance;
};

export default useAxios;
