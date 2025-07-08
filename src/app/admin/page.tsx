"use client";

import { useAdminAuth } from "@/components/Providers/AdminAuthProvider";
import AdminAccess from "@/components/Forms/AdminAccess/AdminAccess";
import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";

export default function AdminPage() {
  const { isAdminVerified } = useAdminAuth();

  return isAdminVerified ? <AdminDashboard /> : <AdminAccess />;
}
