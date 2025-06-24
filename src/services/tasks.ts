import { TaskFormData } from "@/types/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("adminToken")
    : null;
}

export async function createAdminToken(password: string): Promise<string> {
  const res = await fetch("/api/admin/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    throw new Error("Failed to create admin token");
  }

  const data = await res.json();
  localStorage.setItem("adminToken", data.token);
  return data.token;
}

export async function fetchTasks() {
  try {
    const res = await fetch("/api/tasks");
    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.statusText}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid tasks data format");
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchTaskById(taskId: string) {
  const res = await fetch(`${baseUrl}/api/task/${taskId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }

  return res.json();
}

// only admin
export async function createTask(formData: TaskFormData) {
  const token = getToken();
  if (!token) throw new Error("No admin token found");

  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(editId: string, formData: TaskFormData) {
  const token = getToken();
  if (!token) throw new Error("No admin token found");

  const res = await fetch(`/api/task/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No admin token found");

  const response = await fetch(`/api/task/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "Failed to delete task");
  }
}
