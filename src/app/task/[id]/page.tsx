"use client";

import { Task } from "@/types/types";
import TheoryTest from "@/components/TheoryTest/TheoryTest";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

import TaskTopSection from "@/components/TaskTopSection/TaskTopSection";
import { use, useEffect, useState } from "react";
import { fetchTaskById } from "@/services/tasks";

export default function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: taskId } = use(params);

  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTaskById(taskId);
        setTask(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      }
    };

    fetchData();
  }, [taskId]);

  if (error) return <div>Error: {error}</div>;
  if (!task) return <div>Loading...</div>;

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
