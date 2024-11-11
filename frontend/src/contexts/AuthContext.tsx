import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";

interface AuthTokens {
  access: string;

  refresh: string;
}

interface User {
  id: number;

  email: string;

  first_name: string;

  last_name: string;

  role: "job_seeker" | "company" | "admin";
  user_id: number;
}

interface RegisterFormData {
  email: string;

  password: string;

  first_name: string;

  last_name: string;

  role: "job_seeker" | "company" | "admin";

  profile_picture?: File;
}

interface AuthContextType {
  baseURL: string;

  user: User | null;

  authTokens: AuthTokens | null;

  setAuthTokens: React.Dispatch<React.SetStateAction<AuthTokens | null>>;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  registerUser: (formData: RegisterFormData) => Promise<Response | Error>;

  loginUser: (formData: {
    email: string;

    password: string;
  }) => Promise<{ status: number; data: AuthTokens }>;

  logoutUser: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const baseURL = "http://127.0.0.1:8000";

  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const storedTokens = localStorage.getItem("authTokens");

    return storedTokens ? JSON.parse(storedTokens) : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedTokens = localStorage.getItem("authTokens");

    if (storedTokens) {
      const tokens = JSON.parse(storedTokens);

      try {
        return jwtDecode(tokens.access);
      } catch {
        return null;
      }
    }

    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authTokens) {
      localStorage.setItem("authTokens", JSON.stringify(authTokens));

      setUser(jwtDecode(authTokens.access));
    } else {
      localStorage.removeItem("authTokens");

      setUser(null);
    }
  }, [authTokens]);

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);

      const currentTime = Date.now() / 1000;

      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedTokens = localStorage.getItem("authTokens");

      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);

        if (isTokenValid(tokens.access)) {
          setAuthTokens(tokens);

          setUser(jwtDecode(tokens.access));
        } else {
          setAuthTokens(null);

          setUser(null);

          localStorage.removeItem("authTokens");

          navigate("/login");
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, [navigate]);

  const loginUser = async (formData: { email: string; password: string }) => {
    try {
      const response = await fetch(`${baseURL}/auth/token/`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: formData.email,

          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);

        const decodedUser = jwtDecode(data.access);

        setUser(decodedUser);

        localStorage.setItem("authTokens", JSON.stringify(data));

        navigate("/");

        return { status: response.status, data };
      } else {
        return { status: response.status, data };
      }
    } catch (error) {
      console.error("Login error:", error);

      return {
        status: 500,

        data: { detail: "An error occurred during login" },
      };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);

    setUser(null);

    localStorage.removeItem("authTokens");

    navigate("/login");
  };

  const registerUser = async (
    formData: RegisterFormData
  ): Promise<Response | Error> => {
    try {
      if (!formData.profile_picture) {
        delete formData.profile_picture;
      }

      const formDataObj = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value as string);
      });

      const response = await fetch(
        `${baseURL}/api/users-management/register/`,

        {
          method: "POST",

          body: formDataObj,
        }
      );

      return response;
    } catch (error) {
      console.error("Error fetching requests:", error);

      return error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  };

  const contextData: AuthContextType = {
    baseURL,

    user,

    authTokens,

    setAuthTokens,

    setUser,

    registerUser,

    loginUser,

    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
