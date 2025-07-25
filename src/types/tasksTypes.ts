import { Dispatch, JSX, SetStateAction } from "react";

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

export interface TasksResponse {
  tasks: Task[];
  userTasks?: UserTask[];
}

export interface UserTask {
  task_id: string;
  submitted: boolean;
  result?: number;
  solution?: string;
}

export interface TaskResponse {
  task: Task;
  userTask?: UserTask;
}

export interface PropsTask {
  task: Task;
}

export type Level = "beginner" | "intermediate" | "advanced";
export type Language = "javascript" | "python" | "java";
export type TaskType = "theory" | "practice";
export type Completion = "solved" | "unsolved";

export type TaskWithCompletion = Task & { solved?: boolean };
export interface TasksListProps {
  tasks: TaskWithCompletion[];
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
  taskId: string;
  result?: number;
}

export interface CodeTaskTest<
  Input extends unknown[] = unknown[],
  Output = unknown
> {
  id?: string;
  input: Input | Input[];
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
  completion: Completion[];
  setCompletion: Dispatch<SetStateAction<Completion[]>>;
}

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  icon: JSX.Element;
}

export interface CodeEditorProps {
  task: CodeTask;
  language: Language;
  taskId: string;
  solution?: string;
}

export interface CodeFormProps {
  task: CodeEditorProps["task"];
  language: CodeEditorProps["language"];
  setOutput: React.Dispatch<React.SetStateAction<string[]>>;
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: string;
  solution?: string;
}

export interface TestEditProps {
  test_case: CodeTaskTest;
  index: number;
  onChange: (
    index: number,
    updatedTest: { input: unknown[]; expected: unknown }
  ) => void;
  onRemove: (index: number, testId?: string) => void;
}

export interface TaskFormProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  editId: string | null;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
  emptyQuestion: () => Question;
  emptyCodeTask: () => CodeTask;
  onSubmitSuccess?: () => void;
  cancelEdit: () => void;
}

export interface PracticeInputsProps {
  code_task: CodeTask;
  onChange: <K extends keyof CodeTask>(key: K, value: CodeTask[K]) => void;
  onTestChange: (
    index: number,
    updatedTest: { input: unknown[]; expected: unknown }
  ) => void;
  onTestRemove: (index: number, testId?: string) => void;
}

export interface TheoryInputsProps {
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

export interface TaskFormData {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  language: "javascript" | "python" | "java";
  type: "theory" | "practice";
  theory_question?: Question[];
  code_task?: CodeTask[];
}
