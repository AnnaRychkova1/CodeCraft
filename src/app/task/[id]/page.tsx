import { notFound } from "next/navigation";
import { Task } from "@/types/types";
import TheoryTest from "@/components/TheoryTest/TheoryTest";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

import TaskTopSection from "@/components/TaskTopSection/TaskTopSection";

export type Props = {
  params: { id: string };
};

export default async function TaskPage({ params }: Props) {
  const resolvedParams = params;
  const taskId = resolvedParams.id;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/task/${taskId}`);

  if (!res.ok) {
    notFound();
  }

  const task: Task = await res.json();

  return (
    <>
      <TaskTopSection task={task} />
      {task.type === "theory" && task.theoryQuestions && (
        <TheoryTest theoryQuestions={task.theoryQuestions} />
      )}

      {task.type === "practice" && task.codeTask && (
        <CodeEditor task={task.codeTask} language={task.language} />
      )}
    </>
  );
}
