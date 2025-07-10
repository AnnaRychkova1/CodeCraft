import CodeMirror from "@uiw/react-codemirror";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { autocompletion } from "@codemirror/autocomplete";

import type { CodeFormProps } from "@/types/tasksTypes";
import { submitUserTaskResult } from "@/services/tasks";
import { runPythonCode } from "@/utils/runPythonCode";
import { runJavaScriptCode } from "@/utils/runJavaScriptCode";
import { runJavaCode } from "@/utils/runJavaCode";
import {
  getIndentExtensions,
  normalizeCode,
  pythonCompletion,
} from "@/helpers/codeHelpers";

import Loader from "@/components/Loader/Loader";
import css from "./CodeForm.module.css";

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
  const initialCode = normalizeCode(
    isAuthenticated && solution ? solution : task.starter_code || ""
  );
  const indentExtensions = getIndentExtensions(language);
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
        results = await runJavaCode(codeToRun, tests);
      } else if (language === "python") {
        results = await runPythonCode(codeToRun, tests);
      } else {
        results = [
          `❌ Execution for language "${language}" is not supported yet.`,
        ];
      }

      if (results.length === 1 && results[0] === "Too many requests") {
        toast.error("Too many attempts. Please wait before trying again.");
        setOutput([]);
        return;
      }

      if (
        results.length === 1 &&
        !results[0].startsWith("passed") &&
        !results[0].startsWith("not passed:")
      ) {
        toast.error(`Error: ${results[0]}`);
        setOutput([]);
        return;
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
      {isAuthenticated && solution && (
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
          extensions={[
            languageExtension,
            ...indentExtensions,
            language === "python"
              ? autocompletion({ override: [pythonCompletion] })
              : [],
          ].filter(Boolean)}
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
