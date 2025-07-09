import type { Admin } from "@/types/adminTypes";
import { handleResponse } from "@/utils/handleResponse";

export async function getAdminAccess(admin: Admin) {
  const res = await fetch("/api/admin/access/access", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(admin),
  });

  await handleResponse(res);
}

export async function verifyAdminToken(): Promise<boolean> {
  const res = await fetch("/api/admin/access/verify", {
    method: "POST",
    credentials: "include",
  });

  const data = await handleResponse<{ valid: boolean }>(res);
  return data.valid === true;
}

export async function removeAdminAccess(): Promise<void> {
  const res = await fetch("/api/admin/access/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Logout failed");
  }

  await handleResponse(res);
}
