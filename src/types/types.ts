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
  test: { id?: string; input: unknown[]; expected: unknown };
  index: number;
  onChange: (
    index: number,
    updatedTest: { input: unknown[]; expected: unknown }
  ) => void;
  onRemove: (index: number, testId?: string) => void;
};

export type TaskFormProps = {
  formData: Omit<Task, "id">;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Task, "id">>>;
  editId: string | null;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
  emptyQuestion: Question;
  emptyCodeTask: CodeTask;
  fetchTasks: () => Promise<void>;
};

export interface PropsPracticeInputs {
  codeTask: CodeTask;
  onChange: <K extends keyof CodeTask>(key: K, value: CodeTask[K]) => void;
  onTestChange: (
    index: number,
    updatedTest: { input: unknown[]; expected: unknown }
  ) => void;
  onTestRemove: (index: number, testId?: string) => void;
}

export interface PropsheoryInputs {
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
