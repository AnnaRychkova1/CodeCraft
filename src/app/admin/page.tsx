"use client";

import { useAdminAuth } from "@/components/Providers/AdminAuthProvider";

import dynamic from "next/dynamic";

const AdminDashboard = dynamic(
  () => import("@/components/AdminDashboard/AdminDashboard")
);

const AdminAccess = dynamic(
  () => import("@/components/Forms/AdminAccess/AdminAccess")
);

export default function AdminPage() {
  const { isAdminVerified } = useAdminAuth();

  return isAdminVerified ? <AdminDashboard /> : <AdminAccess />;
}
