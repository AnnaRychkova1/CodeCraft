"use client";

// import type { AdminAuthContextType } from "@/types/adminTypes";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { verifyAdminToken } from "@/services/admin";

type AdminAuthContextType = {
  isAdminVerified: boolean;
  sessionExpired: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  setSessionExpired: (val: boolean) => void;
  setIsAdminVerified: (val: boolean) => void;
  adminToken: string | null;
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
      } catch (err) {
        console.error("Token verification error:", err);
        setIsAdminVerified(false);
        setSessionExpired(true);
      } finally {
        // setChecked(true);
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
        setSessionExpired,
        adminToken,
        setIsAdminVerified,
        // checked,
        // setChecked,
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
