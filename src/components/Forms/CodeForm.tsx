import CodeMirror from "@uiw/react-codemirror";
import { useRef } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { runJavaScriptCode } from "@/utils/runJavaScriptCode";
import { runPythonCode } from "@/utils/runPythonCode";
import { runJavaCode } from "@/utils/runJavaCode";
import css from "./codeform.module.css";
import { CodeFormProps } from "@/types/types";

export default function CodeForm({
  task,
  language,
  setOutput,
  setShowConfetti,
}: CodeFormProps) {
  const codeRef = useRef((task.starterCode || "").replace(/\\n/g, "\n"));
  const languageExtension = () => {
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
  };

  const runCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codeRef.current;

    const tests = task.tests || [];

    let results: string[] = [];
    if (language === "javascript") {
      results = runJavaScriptCode(code, tests);
    } else if (language === "java") {
      results = runJavaCode(code, tests);
    } else if (language === "python") {
      results = await runPythonCode(code, tests);
    } else {
      results = [
        `❌ Execution for language "${language}" is not supported yet.`,
      ];
    }

    setOutput(results);

    const allPassed = results.every((res) => res === "passed");
    setShowConfetti(allPassed);
  };
  return (
    <form className={css.form} onSubmit={runCode}>
      <CodeMirror
        value={codeRef.current}
        height="400px"
        extensions={[languageExtension()]}
        onChange={(value) => {
          codeRef.current = value;
        }}
        className={css.codeArea}
      />
      <button type="submit" className={css.runBtn}>
        Run Code
      </button>
    </form>
  );
}
