import { notFound } from "next/navigation";
import Link from "next/link";
import tasks from "../../../../data/tasks.json";
import css from "./taskpage.module.css";
import TheoryQuiz from "@/components/TheoryQuiz/TheoryQuiz";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import { MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { FaJava, FaBookOpen } from "react-icons/fa";
import { GiHammerBreak } from "react-icons/gi";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TaskPage({ params }: Props) {
  const resolvedParams = await params;
  const taskId = resolvedParams.id;

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    notFound();
  }

  // Here you can upload task data by id (for example, fetch)
  // If the task is not found, you can show 404:
  // if (!taskExists(id)) notFound();

  return (
    <>
      <section>
        <div className={css.backContainer}>
          <Link href="/" className={css.backLink}>
            ← Back to Home
          </Link>
        </div>
        <div className={css.descriptionBox}>
          <div className={css.textBox}>
            <h2 className={css.title}>{task.title}</h2>
            <p className={css.description}>{task.description}</p>
          </div>
          <div className={css.labelBox}>
            <div className={css.levelDescr}>
              <span className={css.label}>Level: </span>
              {
                {
                  beginner: <MdLooksOne className={css.levelBeginner} />,
                  intermediate: (
                    <MdLooksTwo className={css.levelIntermediate} />
                  ),
                  advanced: <MdLooks3 className={css.levelAdvanced} />,
                }[task.level]
              }
              <span>{task.level}</span>
            </div>

            <div className={css.levelDescr}>
              <span className={css.label}>Language: </span>
              {
                {
                  javascript: (
                    <SiJavascript className={css.languageJavascript} />
                  ),
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
        </div>
      </section>
      {task.type === "theory" && task.questions && (
        <TheoryQuiz questions={task.questions} />
      )}

      {task.type === "practice" && task.codeTask && (
        <CodeEditor task={task.codeTask} />
      )}
    </>
  );
}
