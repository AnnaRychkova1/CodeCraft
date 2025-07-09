"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { verifyAdminToken } from "@/services/admin";

type AdminAuthContextType = {
  isAdminVerified: boolean;
  adminToken: string | null;
  sessionExpired: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  setIsAdminVerified: (val: boolean) => void;
};

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
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const pathname = usePathname() as string;

  const loginAdmin = () => {
    setAdminToken(adminToken);
    setIsAdminVerified(true);
    setSessionExpired(false);
  };

  const logoutAdmin = () => {
    setIsAdminVerified(false);
    setAdminToken(null);
  };

  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;
    const checkToken = async () => {
      if (!adminToken) {
        setIsAdminVerified(false);
        setSessionExpired(true);
        return;
      }

      try {
        const valid = await verifyAdminToken();

        if (valid) {
          setIsAdminVerified(true);
          setSessionExpired(false);
        } else {
          setIsAdminVerified(false);
          setSessionExpired(true);
        }
      } catch {
        setIsAdminVerified(false);
        setSessionExpired(true);
      }
    };

    checkToken();
  }, [adminToken]);

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminVerified,
        sessionExpired,
        loginAdmin,
        logoutAdmin,
        adminToken,
        setIsAdminVerified,
      }}
    >
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
