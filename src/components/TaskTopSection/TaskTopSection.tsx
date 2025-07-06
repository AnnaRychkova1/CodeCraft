import Link from "next/link";
import { MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { FaJava, FaBookOpen } from "react-icons/fa";
import { GiHammerBreak } from "react-icons/gi";
import type { PropsTask } from "@/types/tasksTypes";
import { formatTextWithLineBreaks } from "@/helpers/formatTextWithLineBreaks";
import css from "./taskTopSection.module.css";

export default function TaskTopSection({ task }: PropsTask) {
  return (
    <section className={css.topSection}>
      <div className={css.descriptionBox}>
        <div className={css.labelBox}>
          <Link href="/" className={css.backLink}>
            ← Back to Home
          </Link>
          <div className={css.levelDescr}>
            <span className={css.label}>Level: </span>
            {
              {
                beginner: <MdLooksOne className={css.levelBeginner} />,
                intermediate: <MdLooksTwo className={css.levelIntermediate} />,
                advanced: <MdLooks3 className={css.levelAdvanced} />,
              }[task.level]
            }
            <span>{task.level}</span>
          </div>

          <div className={css.levelDescr}>
            <span className={css.label}>Language: </span>
            {
              {
                javascript: <SiJavascript className={css.languageJavascript} />,
                python: <SiPython className={css.languagePython} />,
                java: <FaJava className={css.languageJava} />,
              }[task.language]
            }
            <span>{task.language}</span>
          </div>

          <div className={css.levelDescr}>
            <span className={css.label}>Type: </span>
            {
              {
                theory: <FaBookOpen className={css.typeTheory} />,
                practice: <GiHammerBreak className={css.typePractice} />,
              }[task.type]
            }
            <span>{task.type}</span>
          </div>
        </div>
        <div className={css.textBox}>
          <h2 className={css.title}>{task.title}</h2>
          {task.type === "theory" && task.theory_question && (
            <p className={css.description}>
              {formatTextWithLineBreaks(task.description)}
            </p>
          )}

          {task.type === "practice" && task.code_task?.[0]?.prompt && (
            <p className={css.description}>
              {formatTextWithLineBreaks(task.code_task[0].prompt)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
