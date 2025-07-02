"use client";

import { use, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { CodeTask, Task } from "@/types/types";
import { fetchTaskById } from "@/services/tasks";
import Loader from "@/components/Loader/Loader";
import TheoryTest from "@/components/TheoryTest/TheoryTest";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import TaskTopSection from "@/components/TaskTopSection/TaskTopSection";

type Props = {
  params: Promise<{ id: string }>;
};

export default function TaskPage({ params }: Props) {
  const { id } = use(params);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function loadTask() {
      setLoading(true);
      setLoadError(false);
      try {
        const fetchedTask = await fetchTaskById(id);
        if (!fetchedTask) {
          setLoadError(true);
          toast.error("Task not found");
          return;
        }
        setTask(fetchedTask);
        toast.success("Task loaded successfully", { id: "load-success" });
      } catch (error: unknown) {
        setLoadError(true);
        toast.error(
          error instanceof Error ? error.message : "Failed to load task",
          { id: "load-error" }
        );
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id]);

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
        <TheoryTest theoryQuestions={task.theory_question} />
      )}

      {task.type === "practice" &&
        Array.isArray(task.code_task) &&
        task.code_task.map((codeTask: CodeTask, index: number) => (
          <CodeEditor key={index} task={codeTask} language={task.language} />
        ))}
    </>
  );
}
