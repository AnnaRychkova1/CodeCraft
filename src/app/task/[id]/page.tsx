"use client";
// import { notFound } from "next/navigation";
import { Task } from "@/types/types";
import TheoryTest from "@/components/TheoryTest/TheoryTest";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

import TaskTopSection from "@/components/TaskTopSection/TaskTopSection";
import { use, useEffect, useState } from "react";
import { fetchTaskById } from "@/services/tasks";
// import { fetchTaskById } from "@/services/tasks";

// type Props = {
//   params: Promise<{ id: string }>;
// };
// type Props = {
//   params: { id: string };
// };
export default function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: taskId } = use(params);
  // export default function TaskPage({ params }: Props) {
  //   // const resolvedParams = params;
  //   // const taskId = resolvedParams.id;
  //   const taskId = params.id;
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchTask = async () => {
  //     try {
  //       const res = await fetch(`/api/public/task/${taskId}`);
  //       if (!res.ok) throw new Error("Failed to fetch task");
  //       const data = await res.json();
  //       setTask(data);
  //     } catch (err: unknown) {
  //       if (err instanceof Error) {
  //         setError(err.message);
  //       } else {
  //         setError("Unknown error");
  //       }
  //     }
  //   };

  //   fetchTask();
  // }, [taskId]);

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

  // let task: Task | null = null;

  // // try {
  // //   // task = await fetchTaskById(taskId);
  // //   console.log(task);
  // // } catch (error) {
  // //   console.log(error);
  // //   notFound();
  // // }
  // try {
  //   const res = await fetch(`/api/public/task/${taskId}`, {
  //     cache: "no-store", // або можна прибрати, якщо хочеш
  //   });

  //   if (!res.ok) {
  //     throw new Error("Failed to fetch task");
  //   }

  //   task = await res.json();
  // } catch (error) {
  //   console.error(error);
  //   notFound();
  // }

  // if (!task) {
  //   notFound();
  // }

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
