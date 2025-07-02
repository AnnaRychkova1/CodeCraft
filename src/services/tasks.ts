import { Task, TaskFormData } from "@/types/types";
import { handleResponse } from "@/utils/handleResponse";

function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("adminToken")
    : null;
}

export async function getAdminAccess(password: string): Promise<string> {
  const res = await fetch("/api/admin/access/access", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const data = await handleResponse<{ token: string }>(res);
  localStorage.setItem("adminToken", data.token);
  return data.token;
}

export const verifyAdminToken = async (token: string): Promise<boolean> => {
  const res = await fetch("/api/admin/access/verifyToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleResponse<{ valid: boolean }>(res);
  return data.valid === true;
};

export async function fetchTasks() {
  const res = await fetch("/api/public/tasks");
  const data = await handleResponse<Task[]>(res);

  if (!Array.isArray(data)) {
    throw new Error("Invalid tasks data format");
  }
  return data;
}

export async function fetchTaskById(taskId: string) {
  const res = await fetch(`/api/public/task/${taskId}`, {
    cache: "no-store",
  });

  return handleResponse<Task>(res);
}

// only admin
export async function createTask(formData: TaskFormData) {
  const token = getToken();
  if (!token) throw new Error("No admin token found");

  const res = await fetch("/api/admin/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  return handleResponse(res);
}

export async function updateTask(editId: string, formData: TaskFormData) {
  const token = getToken();
  if (!token) throw new Error("No admin token found");

  const res = await fetch(`/api/admin/task/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  return handleResponse(res);
}

export async function deleteTask(id: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No admin token found");

  const res = await fetch(`/api/admin/task/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await handleResponse(res);
}
