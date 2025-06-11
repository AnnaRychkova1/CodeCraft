"use client";

import type { Level, Language, TaskType, Task } from "@/types/types";
import { MdFilterList } from "react-icons/md";
import tasks from "../../../data/tasks.json" assert { type: "json" };
import { resetFilters } from "@/utils/resetFilters";
import { useState } from "react";

import css from "./tasks.module.css";
import TasksList from "@/components/TasksList/TasksList";
import Filtering from "@/components/Filtering/Filtering";

export default function Tasks() {
  const [level, setLevel] = useState<Level[]>([]);
  const [language, setLanguage] = useState<Language[]>([]);
  const [type, setType] = useState<TaskType[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const typedTasks = tasks as Task[];

  const filteredTasks = typedTasks.filter((task) => {
    return (
      (level.length === 0 || level.includes(task.level)) &&
      (language.length === 0 || language.includes(task.language)) &&
      (type.length === 0 || type.includes(task.type))
    );
  });

  return (
    <section className={css.section}>
      <h2 className={css.title}>Select a Task to Get Started</h2>
      <div className={css.topbox}>
        <div className={css.titleBox}>
          <MdFilterList className={css.icon} />
          <h3 className={css.titleFilter}>Filters</h3>
        </div>
        <div className={css.dropdownWrap}>
          <button
            className={css.toggleBtn}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 15l-6-6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>

          {showFilters && (
            <div className={css.dropdownMenu}>
              <Filtering
                level={level}
                setLevel={setLevel}
                language={language}
                setLanguage={setLanguage}
                type={type}
                setType={setType}
                onResetFilters={() =>
                  resetFilters(setLevel, setLanguage, setType)
                }
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => resetFilters(setLevel, setLanguage, setType)}
          className={css.clearBtn}
          disabled={
            level.length === 0 && language.length === 0 && type.length === 0
          }
        >
          Clear filters
        </button>
      </div>

      <div className={css.tasks}>
        <aside className={css.sidebar}>
          <Filtering
            level={level}
            setLevel={setLevel}
            language={language}
            setLanguage={setLanguage}
            type={type}
            setType={setType}
            onResetFilters={() => resetFilters(setLevel, setLanguage, setType)}
          />
        </aside>

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
