"use client";

import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";

import css from "./codeeditor.module.css";
import { CodeEditorProps } from "@/types/types";
import CodeForm from "../Forms/CodeForm";

export default function CodeEditor({ task, language }: CodeEditorProps) {
  const [output, setOutput] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (output.length > 0 && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  return (
    <section className={css.editorSection}>
      <div className={css.editorContainer}>
        <CodeForm
          task={task}
          language={language}
          setOutput={setOutput}
          setShowConfetti={setShowConfetti}
        />
        {output.length > 0 && (
          <div className={css.outputBox} ref={outputRef}>
            <strong>Results:</strong>
            {output.map((result, index) => {
              const isPassed = result === "passed";
              return (
                <ul
                  key={index}
                  style={{
                    color: isPassed ? "green" : "red",
                    fontWeight: isPassed ? "600" : "400",
                  }}
                >
                  {isPassed ? (
                    <li className={css.testResult}>
                      ✅ Test {index + 1} passed successfully!
                    </li>
                  ) : (
                    <li className={css.testResult}>
                      ❌ Test {index + 1} failed:{" "}
                      {result.replace("not passed: ", "")}
                    </li>
                  )}
                </ul>
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
      </div>
    </section>
  );
}
