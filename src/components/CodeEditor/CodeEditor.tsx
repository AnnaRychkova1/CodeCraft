"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import css from "./codeeditor.module.css";
import { CodeEditorProps } from "@/types/types";
import { runJavaScriptCode } from "@/utils/runJavaScriptCode";
import { runPythonCode } from "@/utils/runPythonCode";
import { runJavaCode } from "@/utils/runJavaCode";

export default function CodeEditor({ task, language }: CodeEditorProps) {
  const [code, setCode] = useState(task.starterCode || "");
  const [output, setOutput] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

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

  useEffect(() => {
    if (showConfetti) {
      setConfettiVisible(true);

      const hideDelay = setTimeout(() => {
        setConfettiVisible(false);
      }, 5000);

      const removeDelay = setTimeout(() => {
        setShowConfetti(false);
      }, 7000);

      return () => {
        clearTimeout(hideDelay);
        clearTimeout(removeDelay);
      };
    }
  }, [showConfetti]);

  return (
    <section className={css.editorContainer}>
      <form className={css.form} onSubmit={runCode}>
        <CodeMirror
          value={code}
          height="400px"
          extensions={[languageExtension()]}
          onChange={(value) => setCode(value)}
          className={css.codeArea}
        />
        <button type="submit" className={css.runBtn}>
          Run Code
        </button>
      </form>
      {output.length > 0 && (
        <div className={css.outputBox}>
          <strong>Results:</strong>
          {output.map((result, index) => {
            const isPassed = result === "passed";
            return (
              <li
                key={index}
                style={{
                  color: isPassed ? "green" : "red",
                  fontWeight: isPassed ? "600" : "400",
                }}
              >
                {isPassed ? (
                  <p>✅ Test {index + 1} passed successfully!</p>
                ) : (
                  <p>
                    ❌ Test {index + 1} failed:{" "}
                    {result.replace("not passed: ", "")}
                  </p>
                )}
              </li>
            );
          })}
        </div>
      )}
      {showConfetti && (
        <div
          className={`${css.confetti} ${confettiVisible ? css.visible : ""}`}
        >
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
    </section>
  );
}
