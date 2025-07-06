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

export default function CodeForm({
  task,
  language,
  setOutput,
  setShowConfetti,
}: CodeFormProps) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(
    (task.starter_code || "").replace(/\\n/g, "\n")
  );

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
      } else {
        toast.error("Some tests failed. Check the output above.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={css.form} onSubmit={runCode}>
      <CodeMirror
        value={code}
        onChange={(value) => setCode(value)}
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
  );
}
