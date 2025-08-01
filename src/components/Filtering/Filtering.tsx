"use client";

import { useSession } from "next-auth/react";
import { MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { FaJava, FaBookOpen, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { GiHammerBreak } from "react-icons/gi";
import type {
  Level,
  Language,
  TaskType,
  FilteringProps,
  FilterOption,
  Completion,
} from "@/types/tasksTypes";
import css from "./Filtering.module.css";

const toggleValue = <T extends string>(
  value: T,
  list: T[],
  setList: (val: T[]) => void
) => {
  if (list.includes(value)) {
    setList(list.filter((v) => v !== value));
  } else {
    setList([...list, value]);
  }
};

const levels: FilterOption<Level>[] = [
  {
    value: "beginner",
    label: "Beginner",
    icon: <MdLooksOne className={css.levelBeginner} />,
  },
  {
    value: "intermediate",
    label: "Intermediate",
    icon: <MdLooksTwo className={css.levelIntermediate} />,
  },
  {
    value: "advanced",
    label: "Advanced",
    icon: <MdLooks3 className={css.levelAdvanced} />,
  },
] as const;

const languages: FilterOption<Language>[] = [
  {
    value: "python",
    label: "Python",
    icon: <SiPython className={css.languagePython} />,
  },
  {
    value: "java",
    label: "Java",
    icon: <FaJava className={css.languageJava} />,
  },
  {
    value: "javascript",
    label: "JavaScript",
    icon: <SiJavascript className={css.languageJavascript} />,
  },
] as const;

const types: FilterOption<TaskType>[] = [
  {
    value: "theory",
    label: "Theory",
    icon: <FaBookOpen className={css.typeTheory} />,
  },
  {
    value: "practice",
    label: "Practice",
    icon: <GiHammerBreak className={css.typePractice} />,
  },
] as const;

const completions: FilterOption<Completion>[] = [
  {
    value: "solved",
    label: "Solved",
    icon: <FaCheckCircle className={css.completionSolved} />,
  },
  {
    value: "unsolved",
    label: "Unsolved",
    icon: <FaRegCircle className={css.completionUnsolved} />,
  },
];

export default function Filtering({
  level,
  setLevel,
  language,
  setLanguage,
  type,
  setType,
  completion,
  setCompletion,
}: FilteringProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  return (
    <div className={css.container}>
      {/* Level Filter */}
      <div className={css.filterContainer}>
        <h4>Level</h4>
        <div className={css.optionGroup}>
          {levels.map(({ value, label, icon }) => (
            <div key={value} className={css.optionBox}>
              <button
                type="button"
                aria-label={`${label} filter`}
                className={`${css.optionBtn} ${
                  level.includes(value) ? css.active : ""
                }`}
                onClick={() => toggleValue<Level>(value, level, setLevel)}
              >
                {level.includes(value) && (
                  <span className={css.checkmark}>✔</span>
                )}
              </button>
              <span className={css.filterDescr}>
                {icon}
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div className={css.filterContainer}>
        <h4>Language</h4>
        <div className={css.optionGroup}>
          {languages.map(({ value, label, icon }) => (
            <div key={value} className={css.optionBox}>
              <button
                type="button"
                aria-label={`${label} filter`}
                className={`${css.optionBtn} ${
                  language.includes(value) ? css.active : ""
                }`}
                onClick={() =>
                  toggleValue<Language>(value, language, setLanguage)
                }
              >
                {language.includes(value) && (
                  <span className={css.checkmark}>✔</span>
                )}
              </button>
              <span className={css.filterDescr}>
                {icon}
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className={css.filterContainer}>
        <h4>Type</h4>
        <div className={css.optionGroup}>
          {types.map(({ value, label, icon }) => (
            <div key={value} className={css.optionBox}>
              <button
                type="button"
                aria-label={`${label} filter`}
                className={`${css.optionBtn} ${
                  type.includes(value) ? css.active : ""
                }`}
                onClick={() => toggleValue<TaskType>(value, type, setType)}
              >
                {type.includes(value) && (
                  <span className={css.checkmark}>✔</span>
                )}
              </button>
              <span className={css.filterDescr}>
                {icon}
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted Filter */}
      {isAuthenticated && (
        <div className={css.filterContainer}>
          <h4>Completion</h4>
          <div className={css.optionGroup}>
            {completions.map(({ value, label, icon }) => (
              <div key={value} className={css.optionBox}>
                <button
                  type="button"
                  aria-label={`${label} completion`}
                  className={`${css.optionBtn} ${
                    completion.includes(value) ? css.active : ""
                  }`}
                  onClick={() =>
                    toggleValue<Completion>(value, completion, setCompletion)
                  }
                >
                  {completion.includes(value) && (
                    <span className={css.checkmark}>✔</span>
                  )}
                </button>
                <span className={css.filterDescr}>
                  {icon}
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
