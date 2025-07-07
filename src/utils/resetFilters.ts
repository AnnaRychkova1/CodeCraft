import type { Level, Language, TaskType, Completion } from "@/types/tasksTypes";

export function resetFilters(
  setLevel: (val: Level[]) => void,
  setLanguage: (val: Language[]) => void,
  setType: (val: TaskType[]) => void,
  setCompletion: (val: Completion[]) => void
) {
  setLevel([]);
  setLanguage([]);
  setType([]);
  setCompletion([]);
}
