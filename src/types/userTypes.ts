// DTO (Data Transfer Object)

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserRegisterResponse {
  message: string;
}

export type SubmitUserTaskBody = {
  result?: number;
  solution?: string;
  submitted: boolean;
};

export interface UserProgressResponse {
  allTasks: number;
  doneTasks: number;
  theory: number;
  practice: number;
}
export interface UserProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}
