"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { AdminAuthContextType } from "@/types/adminTypes";

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

type AdminAuthProviderProps = {
  children: ReactNode;
  adminToken?: string | null;
};

export const AdminAuthProvider = ({
  children,
  adminToken: initialToken,
}: AdminAuthProviderProps) => {
  const [adminToken, setAdminToken] = useState<string | null>(
    initialToken || null
  );

  useEffect(() => {
    if (!initialToken) {
      const storedToken = localStorage.getItem("adminToken");
      if (storedToken) {
        setAdminToken(storedToken);
      }
    }
  }, [initialToken]);

  const loginAdmin = (adminToken: string) => {
    setAdminToken(adminToken);
    localStorage.setItem("adminToken", adminToken);
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminAuthContext.Provider value={{ adminToken, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
