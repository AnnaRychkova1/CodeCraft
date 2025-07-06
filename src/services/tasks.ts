import type { ApiResponseMessage } from "@/types/commonTypes";
import type { Task, TaskFormData } from "@/types/tasksTypes";
import { handleResponse } from "@/utils/handleResponse";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/public/tasks");
  const data = await handleResponse<Task[]>(res);

  if (!Array.isArray(data)) {
    throw new Error("Invalid tasks data format");
  }
  return data;
}

export async function fetchTaskById(taskId: string): Promise<Task> {
  const res = await fetch(`/api/public/task/${taskId}`, {
    cache: "no-store",
  });

  return handleResponse<Task>(res);
}

// only admin
export async function createTask(
  formData: TaskFormData
): Promise<ApiResponseMessage> {
  const res = await fetch("/api/admin/tasks", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(res);
}

export async function updateTask(
  editId: string,
  formData: TaskFormData
): Promise<ApiResponseMessage> {
  const res = await fetch(`/api/admin/task/${editId}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(res);
}

export async function deleteTask(id: string): Promise<ApiResponseMessage> {
  const res = await fetch(`/api/admin/task/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(res);
}
