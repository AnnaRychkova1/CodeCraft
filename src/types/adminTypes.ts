import { Task } from "./tasksTypes";

export interface Admin {
  password: string;
}

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
