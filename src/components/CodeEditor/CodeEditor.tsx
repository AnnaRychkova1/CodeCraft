"use client";

import { useState } from "react";
import css from "./codeeditor.module.css";

interface CodeTask {
  prompt: string;
  starterCode?: string;
}

interface CodeEditorProps {
  task: CodeTask;
}

export default function CodeEditor({ task }: CodeEditorProps) {
  const [code, setCode] = useState(task.starterCode || "");

  return (
    <section className={css.editorContainer}>
      <h3>Practice Task</h3>
      <p>{task.prompt}</p>
      <textarea
        className={css.codeArea}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="button" className={css.runBtn}>
        Run
      </button>
    </section>
  );
}
