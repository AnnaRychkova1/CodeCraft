"use client";

import { useState } from "react";
import css from "./theoryquiz.module.css";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface TheoryQuizProps {
  questions: Question[];
}

export default function TheoryQuiz({ questions }: TheoryQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleSelect = (index: number, answer: string) => {
    const updated = [...selectedAnswers];
    updated[index] = answer;
    setSelectedAnswers(updated);
  };

  return (
    <section className={css.quizContainer}>
      <h3>Theory Quiz</h3>
      {questions.map((q, i) => (
        <div key={i} className={css.questionBlock}>
          <p className={css.question}>{q.question}</p>
          <ul className={css.options}>
            {q.options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className={`${css.optionBtn} ${
                    selectedAnswers[i] === opt ? css.selected : ""
                  }`}
                  onClick={() => handleSelect(i, opt)}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
          {selectedAnswers[i] && (
            <p className={css.result}>
              {selectedAnswers[i] === q.correctAnswer
                ? "✅ Correct!"
                : "❌ Wrong"}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
