import { Dispatch, JSX, SetStateAction, TextareaHTMLAttributes } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  level: Level;
  language: Language;
  type: TaskType;
  theory_question?: Question[];
  code_task?: CodeTask[];
}

export type PropsTask = {
  task: Task;
};

export type Level = "beginner" | "intermediate" | "advanced";
export type Language = "javascript" | "python" | "java";
export type TaskType = "theory" | "practice";

export interface TasksListProps {
  tasks: Task[];
  setLevel: (val: Level[]) => void;
  setLanguage: (val: Language[]) => void;
  setType: (val: TaskType[]) => void;
}
export interface Question {
  id?: string;
  question: string;
  options: string[];
  correct_answer: string[];
}

export interface TheoryTestProps {
  theoryQuestions: Question[];
}

export interface CodeTaskTest<
  Input extends unknown[] = unknown[],
  Output = unknown
> {
  id?: string;
  input: Input;
  expected: Output;
}

export interface CodeTask {
  id?: string;
  prompt: string;
  starter_code?: string;
  test_case?: CodeTaskTest[];
}

export interface FilteringProps {
  level: Level[];
  setLevel: Dispatch<SetStateAction<Level[]>>;
  language: Language[];
  setLanguage: Dispatch<SetStateAction<Language[]>>;
  type: TaskType[];
  setType: Dispatch<SetStateAction<TaskType[]>>;
  onResetFilters: () => void;
}

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  icon: JSX.Element;
}

export interface CodeEditorProps {
  task: CodeTask;
  language: Language;
}

export type CodeFormProps = {
  task: CodeEditorProps["task"];
  language: CodeEditorProps["language"];
  setOutput: React.Dispatch<React.SetStateAction<string[]>>;
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TestEditProps = {
  test_case: CodeTaskTest;
  index: number;
  onChange: (
    index: number,
    updatedTest: { input: unknown[]; expected: unknown }
  ) => void;
  onRemove: (index: number, testId?: string) => void;
};

export type TaskFormProps = {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  editId: string | null;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
  emptyQuestion: () => Question;
  emptyCodeTask: () => CodeTask;
  onSubmitSuccess?: () => void;
  cancelEdit: () => void;
};

export interface PropsPracticeInputs {
  code_task: CodeTask;
  onChange: <K extends keyof CodeTask>(key: K, value: CodeTask[K]) => void;
  onTestChange: (
    index: number,
    updatedTest: { input: unknown[]; expected: unknown }
  ) => void;
  onTestRemove: (index: number, testId?: string) => void;
}

export interface PropsTheoryInputs {
  questions: Question[];
  onChange: (
    index: number,
    key: keyof Question,
    value: string | string[]
  ) => void;
  onOptionChange: (qIndex: number, oIndex: number, value: string) => void;
  onOptionRemove: (qIndex: number, oIndex: number) => void;
  onQuestionRemove: (index: number, id?: string) => void;
  onAddQuestion: () => void;
  setQuestions: (questions: Question[]) => void;
}

export type PropsTextArea = TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface TaskFormData {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  language: "javascript" | "python" | "java";
  type: "theory" | "practice";
  theory_question?: Question[];
  code_task?: CodeTask[];
}

export interface FeedbackData {
  email: string;
  feedback: string;
}

export interface AdminAccessFormProps {
  sessionExpired: boolean;
  setSessionExpired: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AdminDashboardProps {
  sessionExpired: boolean;
}

export interface AdminTasksListProps {
  tasks: Task[];
  handleEdit: (taskId: string) => void;
  loadTasks: () => Promise<void>;
  sessionExpired: boolean;
}

export type ApiResponseMessage = {
  message: string;
  id?: string;
};

export interface Admin {
  password: string;
}

export interface AdminAuthContextType {
  adminToken: string | null;
  loginAdmin: (adminToken: string) => void;
  logoutAdmin: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  userToken: string | null;
  loginUser: (userToken: string) => void;
  logoutUser: () => void;
}
