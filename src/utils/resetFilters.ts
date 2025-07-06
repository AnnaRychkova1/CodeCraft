import type { Level, Language, TaskType } from "@/types/tasksTypes";

export function resetFilters(
  setLevel: (val: Level[]) => void,
  setLanguage: (val: Language[]) => void,
  setType: (val: TaskType[]) => void
) {
  setLevel([]);
  setLanguage([]);
  setType([]);
}
