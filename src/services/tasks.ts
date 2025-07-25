import type { ApiResponseMessage } from "@/types/commonTypes";
import type {
  TaskFormData,
  TasksResponse,
  TaskResponse,
} from "@/types/tasksTypes";
import type {
  SubmitUserTaskBody,
  UserProgressResponse,
} from "@/types/userTypes";
import { handleResponse } from "@/utils/handleResponse";

export async function fetchTasks(): Promise<TasksResponse> {
  const res = await fetch("/api/public/tasks");

  return handleResponse<TasksResponse>(res);
}

export async function fetchTaskById(taskId: string): Promise<TaskResponse> {
  const res = await fetch(`/api/public/task/${taskId}`, {
    cache: "no-store",
  });

  return handleResponse<TaskResponse>(res);
}

// loggedin users only
export async function submitUserTaskResult(
  taskId: string,
  payload: SubmitUserTaskBody
): Promise<ApiResponseMessage> {
  const res = await fetch(`/api/user/task/${taskId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<ApiResponseMessage>(res);
}

export async function fetchUserProgress(): Promise<UserProgressResponse> {
  const res = await fetch("/api/user/progress", {
    cache: "no-store",
  });

  return handleResponse<UserProgressResponse>(res);
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
