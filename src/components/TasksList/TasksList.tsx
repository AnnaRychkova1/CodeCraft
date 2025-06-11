"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { FaJava, FaBookOpen } from "react-icons/fa";
import { GiHammerBreak } from "react-icons/gi";
import css from "./taskslist.module.css";
import type { Task, Level, Language, TaskType } from "@/types/types";

interface TasksListProps {
  tasks: Task[];
  setLevel: (val: Level[]) => void;
  setLanguage: (val: Language[]) => void;
  setType: (val: TaskType[]) => void;
}

export default function TasksList({
  tasks,
  setLevel,
  setLanguage,
  setType,
}: TasksListProps) {
  const handleClick = <T extends Level | Language | TaskType>(
    value: T,
    setFn: (val: T[]) => void
  ) => {
    setFn([value]);
  };
  const router = useRouter();

  return (
    <ul className={css.tasksContainer}>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <li key={task.id} className={css.taskItem}>
            <div
              className={css.textBox}
              onClick={() => router.push(`/task/${task.id}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && router.push(`/task/${task.id}`)
              }
            >
              <h2 className={css.title}>{task.title}</h2>
              <p className={css.description}>{task.description}</p>
              <Link href={`/task/${task.id}`} className={css.linkToTask}>
                Go to {task.title}
              </Link>
            </div>
            <div className={css.labelBox}>
              <button
                type="button"
                onClick={() => handleClick(task.level, setLevel)}
                aria-label={`${task.level} level`}
                className={css.iconButton}
              >
                {
                  {
                    beginner: <MdLooksOne className={css.levelBeginner} />,
                    intermediate: (
                      <MdLooksTwo className={css.levelIntermediate} />
                    ),
                    advanced: <MdLooks3 className={css.levelAdvanced} />,
                  }[task.level]
                }
              </button>

              <button
                type="button"
                onClick={() => handleClick(task.language, setLanguage)}
                aria-label={`${task.language}`}
                className={css.iconButton}
              >
                {
                  {
                    python: <SiPython className={css.languagePython} />,
                    java: <FaJava className={css.languageJava} />,
                    javascript: (
                      <SiJavascript className={css.languageJavascript} />
                    ),
                  }[task.language]
                }
              </button>

              <button
                type="button"
                onClick={() => handleClick(task.type, setType)}
                aria-label={`${task.type}`}
                className={css.iconButton}
              >
                {
                  {
                    theory: <FaBookOpen className={css.typeTheory} />,
                    practice: <GiHammerBreak className={css.typePractice} />,
                  }[task.type]
                }
              </button>
            </div>
          </li>
        ))
      ) : (
        <li className={css.noResult}>No tasks match your filters.</li>
      )}
    </ul>
  );
}
