import type { Level, Language, TaskType, Task } from "@/types/types";
import tasks from "../../../data/tasks.json" assert { type: "json" };
import { useState } from "react";

import css from "./tasks.module.css";
import TasksList from "@/components/TasksList/TasksList";
import Filtering from "@/components/Filtering/Filtering";

export default function Tasks() {
  const [level, setLevel] = useState<Level[]>([]);
  const [language, setLanguage] = useState<Language[]>([]);
  const [type, setType] = useState<TaskType[]>([]);

  const typedTasks = tasks as Task[];

  const filteredTasks = typedTasks.filter((task) => {
    return (
      (level.length === 0 || level.includes(task.level)) &&
      (language.length === 0 || language.includes(task.language)) &&
      (type.length === 0 || type.includes(task.type))
    );
  });

  const handleResetFilters = () => {
    setLevel([]);
    setLanguage([]);
    setType([]);
  };
  return (
    <section className={css.section}>
      <h2 className={css.title}>Select a Task to Get Started</h2>
      <div className={css.tasks}>
        <Filtering
          level={level}
          setLevel={setLevel}
          language={language}
          setLanguage={setLanguage}
          type={type}
          setType={setType}
          onResetFilters={handleResetFilters}
        />
        <TasksList
          tasks={filteredTasks}
          setLevel={setLevel}
          setLanguage={setLanguage}
          setType={setType}
        />
      </div>
    </section>
  );
}
