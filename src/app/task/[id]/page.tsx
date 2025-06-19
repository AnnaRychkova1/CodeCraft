import { notFound } from "next/navigation";
import { PropsTaskPage, Task } from "@/types/types";
import TheoryTest from "@/components/TheoryTest/TheoryTest";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

import TaskTopSection from "@/components/TaskTopSection/TaskTopSection";

export default async function TaskPage({ params }: PropsTaskPage) {
  const resolvedParams = await params;
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
