"use client";

import { MdFilterList } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import type { Level, Language, TaskType, Task } from "@/types/types";
import { resetFilters } from "@/utils/resetFilters";
import { fetchTasks } from "@/services/tasks";
import TasksList from "@/components/TasksList/TasksList";
import Filtering from "@/components/Filtering/Filtering";
import Loader from "@/components/Loader/Loader";
import css from "./tasks.module.css";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [level, setLevel] = useState<Level[]>([]);
  const [language, setLanguage] = useState<Language[]>([]);
  const [type, setType] = useState<TaskType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const typedTasks = Array.isArray(tasks) ? (tasks as Task[]) : [];

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      setLoadError(false);
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setLoadError(true);
        toast.error(
          `Error verifying session. Please login again. ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const filteredTasks = typedTasks.filter((task) => {
    return (
      (level.length === 0 || level.includes(task.level)) &&
      (language.length === 0 || language.includes(task.language)) &&
      (type.length === 0 || type.includes(task.type))
    );
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    }

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  return (
    <>
      {showFilters && <div className={css.clickBlocker} />}
      <section className={css.section}>
        <h2 className={css.title}>Select a Task to Get Started</h2>
        <div className={css.topbox}>
          <div className={css.titleBox}>
            <MdFilterList className={css.icon} />
            <h3 className={css.titleFilter}>Filters</h3>
          </div>
          <div className={css.dropdownWrap} ref={dropdownRef}>
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
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
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
              onResetFilters={() =>
                resetFilters(setLevel, setLanguage, setType)
              }
            />
          </aside>

          <div className={css.listWrapper}>
            {loading ? (
              <div className={css.loaderOverlay}>
                <Loader />
              </div>
            ) : loadError ? (
              <div className={css.noResult}>Failed to load tasks.</div>
            ) : filteredTasks.length > 0 ? (
              <TasksList
                tasks={filteredTasks}
                setLevel={setLevel}
                setLanguage={setLanguage}
                setType={setType}
              />
            ) : (
              <div className={css.noResult}>
                No tasks match the selected filters.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
