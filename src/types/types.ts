export type Level = "beginner" | "intermediate" | "advanced";
export type Language = "javascript" | "python" | "java";
export type TaskType = "theory" | "practice";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string[];
}

export interface TheoryQuizProps {
  questions: Question[];
}

export interface CodeTaskTest<
  Input extends unknown[] = unknown[],
  Output = unknown
> {
  input: Input;
  expected: Output;
}

export interface CodeTask {
  prompt: string;
  starterCode?: string;
  tests?: CodeTaskTest[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  level: Level;
  language: Language;
  type: TaskType;
  questions?: Question[];
  codeTask?: CodeTask;
}

export interface CodeEditorProps {
  task: CodeTask;
  language: Language;
}
