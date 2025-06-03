export type Level = "beginner" | "intermediate" | "advanced";
export type Language = "javascript" | "python" | "java";
export type TaskType = "theory" | "practice";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  level: Level;
  language: Language;
  type: TaskType;
  questions?: Question[];
  codeTask?: {
    starterCode: string;
    expectedOutput: string;
  };
}
