"use client";
import Link from "next/link";
import { MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { FaJava, FaBookOpen } from "react-icons/fa";
import { GiHammerBreak } from "react-icons/gi";
import type {
  Level,
  Language,
  TaskType,
  TasksListProps,
} from "@/types/tasksTypes";
import css from "./TasksList.module.css";

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

  return (
    <ul className={css.tasksContainer}>
      {tasks.length > 0 &&
        tasks.map((task) => (
          <li
            key={task.id}
            className={`${css.taskItem} ${
              task.solved ? css.solved : css.unsolved
            }`}
          >
            <Link
              href={`/task/${task.id}`}
              className={css.textBox}
              role="link"
              tabIndex={0}
              prefetch={false}
              aria-label={`Open task "${task.title}"`}
            >
              <h2 className={css.title}>{task.title}</h2>
              <p className={css.description}>{task.description}</p>
              <span className={css.linkToTask}>Go to {task.title}</span>
            </Link>
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
        ))}
    </ul>
  );
}
