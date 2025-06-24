import { notFound } from "next/navigation";
import { Task } from "@/types/types";
import TheoryTest from "@/components/TheoryTest/TheoryTest";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

import TaskTopSection from "@/components/TaskTopSection/TaskTopSection";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TaskPage({ params }: Props) {
  const resolvedParams = await params;
  const taskId = resolvedParams.id;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/task/${taskId}`, {
    cache: "no-store",
  });

  console.log("res.ok:", res.ok);
  console.log("res.status:", res.status);

  if (!res.ok) {
    notFound();
  }

  const task: Task = await res.json();

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
