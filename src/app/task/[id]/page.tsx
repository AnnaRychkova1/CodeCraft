import { notFound } from "next/navigation";
import { Task } from "@/types/types";
import TheoryTest from "@/components/TheoryTest/TheoryTest";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

import TaskTopSection from "@/components/TaskTopSection/TaskTopSection";
import { fetchTaskById } from "@/services/tasks";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TaskPage({ params }: Props) {
  const resolvedParams = await params;
  const taskId = resolvedParams.id;

  let task: Task | null = null;

  try {
    task = await fetchTaskById(taskId);
  } catch (error) {
    console.log(error);
    notFound();
  }

  if (!task) {
    notFound();
  }

  return (
    <>
      <TaskTopSection task={task} />
      {task.type === "theory" && task.theory_question && (
        <TheoryTest theoryQuestions={task.theory_question} />
      )}

      {task.type === "practice" && Array.isArray(task.code_task) && (
        <>
          {task.code_task.map((codeTask, index) => (
            <CodeEditor key={index} task={codeTask} language={task.language} />
          ))}
        </>
      )}
    </>
  );
}
