import { Task } from "./tasksTypes";

export interface Admin {
  password: string;
}

export interface AdminAuthContextType {
  adminToken: string | null;
  loginAdmin: () => void;
  logoutAdmin: () => void;
}

// export interface AdminDashboardProps {
//   sessionExpired: boolean;
// }

// export interface AdminAccessFormProps {
//   sessionExpired: boolean;
//   setSessionExpired: (val: boolean) => void;
// }

export interface AdminTasksListProps {
  tasks: Task[];
  handleEdit: (taskId: string) => void;
  loadTasks: () => Promise<void>;
  // sessionExpired: boolean;
}
