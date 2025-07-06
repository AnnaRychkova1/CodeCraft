"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { verifyAdminToken } from "@/services/admin";
import { useAdminAuth } from "@/components/Providers/AdminAuthProvider";
import AdminAccess from "@/components/Forms/AdminAccess/AdminAccess";
import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";

export default function AdminPage() {
  const admin = useAdminAuth();
  const logoutAdmin = admin.logoutAdmin;
  const adminToken = admin.adminToken;
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!adminToken) return;

      try {
        const valid = await verifyAdminToken();

        if (valid) {
          setIsVerified(true);
        } else {
          logoutAdmin();
          setSessionExpired(true);
          toast.error("Session expired. Please login again.");
        }
      } catch (err) {
        logoutAdmin();
        setSessionExpired(true);
        toast.error(
          `Error verifying session. Please login again. ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    };

    verify();
  }, [adminToken, logoutAdmin]);

  return isVerified ? (
    <AdminDashboard sessionExpired={sessionExpired} />
  ) : (
    <AdminAccess
      sessionExpired={sessionExpired}
      setSessionExpired={setSessionExpired}
    />
  );
}
