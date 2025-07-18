"use client";

import dynamic from "next/dynamic";
import { use, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import type { UserTask, CodeTask, Task } from "@/types/tasksTypes";
import { fetchTaskById } from "@/services/tasks";
import TaskTopSection from "@/components/TaskTopSection/TaskTopSection";
import Loader from "@/components/Loader/Loader";

const TheoryTest = dynamic(() => import("@/components/TheoryTest/TheoryTest"), {
  ssr: false,
  loading: () => <Loader />,
});
const CodeEditor = dynamic(() => import("@/components/CodeEditor/CodeEditor"), {
  ssr: false,
  loading: () => <Loader />,
});

type Props = {
  params: Promise<{ id: string }>;
};

export default function TaskPage({ params }: Props) {
  const { id } = use(params);

  const [task, setTask] = useState<Task | null>(null);
  const [userTask, setUserTask] = useState<UserTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    async function loadTask() {
      setLoading(true);
      setLoadError(false);
      try {
        const { task, userTask } = await fetchTaskById(id);

        const fetchedTask = task;

        if (!fetchedTask) {
          setLoadError(true);
          toast.error("Task not found");
          return;
        }
        setTask(fetchedTask);
        setUserTask(userTask ?? null);
      } catch (err: unknown) {
        setLoadError(true);
        toast.error(
          err instanceof Error ? err.message : "Failed to load task",
          { id: "load-error" }
        );

        const message =
          err instanceof Error ? err.message : "Failed to load task .";
        if (message === "Your session has expired. Please log in again.") {
          signOut();
        }
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id, isAuthenticated]);

  if (loading) {
    return <Loader />;
  }

  if (!id) {
    return <Loader />;
  }

  if (loadError || !task) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Failed to load task.</p>
      </div>
    );
  }

  return (
    <>
      <TaskTopSection task={task} />

      {task.type === "theory" && task.theory_question && (
        <TheoryTest
          theoryQuestions={task.theory_question}
          taskId={task.id}
          result={userTask?.result}
        />
      )}

      {task.type === "practice" &&
        Array.isArray(task.code_task) &&
        task.code_task.map((codeTask: CodeTask, index: number) => (
          <CodeEditor
            key={index}
            task={codeTask}
            language={task.language}
            taskId={task.id}
            solution={userTask?.solution}
          />
        ))}
    </>
  );
}
