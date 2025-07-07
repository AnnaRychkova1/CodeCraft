import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import type { CodeFormProps } from "@/types/tasksTypes";
import { runJavaScriptCode } from "@/utils/runJavaScriptCode";
import { runPythonCode } from "@/utils/runPythonCode";
import { runJavaCode } from "@/utils/runJavaCode";
import Loader from "@/components/Loader/Loader";
import css from "./CodeForm.module.css";
import { submitUserTaskResult } from "@/services/tasks";
import { useSession } from "next-auth/react";

export default function CodeForm({
  task,
  language,
  setOutput,
  setShowConfetti,
  taskId,
  solution,
}: CodeFormProps) {
  const { data: session, status } = useSession();
  const userName = session?.user?.name;
  const isAuthenticated = status === "authenticated";
  const initialCode =
    isAuthenticated && solution
      ? solution.replace(/\\n/g, "\n")
      : (task.starter_code || "").replace(/\\n/g, "\n");
  const [code, setCode] = useState(initialCode);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const languageExtension = (() => {
    switch (language) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "java":
        return java();
      default:
        return [];
    }
  })();

  const handleCodeChange = (value: string) => {
    if (!touched) setTouched(true);
    setCode(value);
  };

  const runCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const codeToRun = code;
      const tests = Array.isArray(task.test_case) ? task.test_case : [];

      let results: string[] = [];
      if (language === "javascript") {
        results = runJavaScriptCode(codeToRun, tests);
      } else if (language === "java") {
        results = runJavaCode(codeToRun, tests);
      } else if (language === "python") {
        results = await runPythonCode(codeToRun, tests);
      } else {
        results = [
          `❌ Execution for language "${language}" is not supported yet.`,
        ];
      }

      setOutput(results);

      const allPassed = results.every((res) => res === "passed");

      if (allPassed) {
        setShowConfetti(true);
        if (isAuthenticated) {
          try {
            const response = await submitUserTaskResult(taskId, {
              solution: code,
              submitted: true,
            });

            if (response?.message) {
              toast.success(response.message);
            }
          } catch (err: unknown) {
            const errorMessage =
              err instanceof Error ? err.message : String(err);
            toast.error(errorMessage || "Failed to submit solution.");
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div className={`${css.solvedContainer} ${touched ? css.hidden : ""}`}>
          <p className={css.helperText}>
            <span className={css.helperName}>Hi, {userName}!</span> This is your
            previously submitted solution. You can modify it or run it as-is.
          </p>
        </div>
      )}
      <form className={css.form} onSubmit={runCode}>
        <CodeMirror
          value={code}
          onChange={handleCodeChange}
          height="400px"
          extensions={[languageExtension]}
          className={css.codeArea}
        />
        {loading ? (
          <Loader />
        ) : (
          <button type="submit" disabled={loading} className={css.runBtn}>
            Run Code
          </button>
        )}
      </form>
    </>
  );
}
