"use client";
import dynamic from "next/dynamic";

import { useAdminAuth } from "@/components/Providers/AdminAuthProvider";
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
