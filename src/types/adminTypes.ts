import { ReactNode } from "react";
import { Task } from "./tasksTypes";

export interface Admin {
  password: string;
}

export type AdminAuthProviderProps = {
  children: ReactNode;
  adminToken?: string | null;
};

export interface AdminAuthContextType {
  adminToken: string | null;
  loginAdmin: () => void;
  logoutAdmin: () => void;
}

export interface AdminTasksListProps {
  tasks: Task[];
  handleEdit: (taskId: string) => void;
  loadTasks: () => Promise<void>;
}
