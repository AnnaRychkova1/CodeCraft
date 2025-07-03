"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType } from "@/types/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  userToken?: string | null;
};

export const AuthProvider = ({
  children,
  userToken: initialToken,
}: AuthProviderProps) => {
  const [userToken, setUserToken] = useState<string | null>(
    initialToken || null
  );

  useEffect(() => {
    if (!initialToken) {
      const storedToken = localStorage.getItem("userToken");
      if (storedToken) {
        setUserToken(storedToken);
      }
    }
  }, [initialToken]);

  const loginUser = (userToken: string) => {
    setUserToken(userToken);
    localStorage.setItem("userToken", userToken);
  };

  const logoutUser = () => {
    setUserToken(null);
    localStorage.removeItem("userToken");
  };

  return (
    <AuthContext.Provider value={{ userToken, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
