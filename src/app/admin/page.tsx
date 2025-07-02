"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { verifyAdminToken } from "@/services/tasks";
import AdminAccess from "@/components/Forms/AdminAccess/AdminAccess";
import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setSessionExpired(false);
        return;
      }

      try {
        const isValid = await verifyAdminToken(token);
        if (isValid) {
          setIsAdmin(true);
          setSessionExpired(false);
        } else {
          localStorage.removeItem("adminToken");
          setIsAdmin(false);
          setSessionExpired(true);
          toast.error("Session expired. Please login again.");
        }
      } catch (err: unknown) {
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
        setSessionExpired(true);
        toast.error(
          `Error verifying session. Please login again. ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    };

    checkToken();
  }, []);

  return isAdmin ? (
    <AdminDashboard
      isAdmin={isAdmin}
      sessionExpired={sessionExpired}
      setIsAdmin={setIsAdmin}
    />
  ) : (
    <AdminAccess setIsAdmin={setIsAdmin} sessionExpired={sessionExpired} />
  );
}
