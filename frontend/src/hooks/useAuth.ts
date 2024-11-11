// src/hooks/useAuth.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/user"; // Ensure this import path is correct

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return React.createElement(
    AuthContext.Provider,
    { value: { user, setUser } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
