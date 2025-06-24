"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import css from "./theorytest.module.css";
import { TheoryTestProps } from "@/types/types";

const isMultipleAnswer = (correctAnswer: string[]): boolean =>
  correctAnswer.length > 1;

export default function TheoryTest({ theoryQuestions }: TheoryTestProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>(
    Array(theoryQuestions.length).fill([])
  );
  const [submitted, setSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  const handleSelect = (index: number, answer: string, isMulti: boolean) => {
    if (submitted) return;

    setSelectedAnswers((prev) => {
      const updated = [...prev];
      const current = updated[index] || [];

      updated[index] = isMulti
        ? current.includes(answer)
          ? current.filter((a) => a !== answer)
          : [...current, answer]
        : [answer];

      return updated;
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;

    theoryQuestions.forEach((q, i) => {
      const correct = [...q.correct_answer].sort();
      const user = [...(selectedAnswers[i] || [])].sort();

      const isCorrect =
        correct.length === user.length &&
        correct.every((ans, idx) => ans === user[idx]);

      if (isCorrect) correctCount++;
    });

    const percent = (correctCount / theoryQuestions.length) * 100;
    setScorePercent(percent);
    setSubmitted(true);

    if (percent === 100) {
      setShowConfetti(true);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(Array(theoryQuestions.length).fill([]));
    setSubmitted(false);
    setScorePercent(null);
    setConfettiVisible(false);
  };

  const getOptionClass = (
    questionIndex: number,
    option: string
  ): string | undefined => {
    if (!submitted) return;

    const question = theoryQuestions[questionIndex];
    const correctAnswers = question.correct_answer;
    const userAnswers = selectedAnswers[questionIndex] || [];

    const isSelected = userAnswers.includes(option);
    const isCorrect = correctAnswers.includes(option);

    if (isSelected && isCorrect) return css.correct;
    if (isSelected && !isCorrect) return css.incorrect;
    if (!isSelected && isCorrect) return css.correct;

    return undefined;
  };

  useEffect(() => {
    if (showConfetti) {
      setConfettiVisible(true);
      const hide = setTimeout(() => setConfettiVisible(false), 5000);
      const remove = setTimeout(() => setShowConfetti(false), 7000);
      return () => {
        clearTimeout(hide);
        clearTimeout(remove);
      };
    }
  }, [showConfetti]);

  return (
    <section className={css.theorySection}>
      <div className={css.theoryContainer}>
        <h3>Theory Test</h3>
        <ol className={css.questionList}>
          {theoryQuestions.map((q, i) => {
            const selected = selectedAnswers[i] || [];

            return (
              <li key={q.id ?? i}>
                <p className={css.question}>{q.question}</p>
                <ul className={css.options}>
                  {q.options.map((opt) => {
                    const checked = selected.includes(opt);
                    const optionClass = getOptionClass(i, opt);
                    const isMulti = isMultipleAnswer(q.correct_answer);

                    return (
                      <li key={opt}>
                        <label className={css.optionLabel}>
                          <input
                            type={isMulti ? "checkbox" : "radio"}
                            name={`question-${i}`}
                            value={opt}
                            checked={checked}
                            onChange={() => handleSelect(i, opt, isMulti)}
                            disabled={submitted}
                            className={css.inputSelector}
                          />
                          <span
                            className={`${css.optionBtn} ${
                              checked ? css.selected : ""
                            } ${optionClass ?? ""}`}
                          >
                            {opt}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>

        {!submitted && (
          <button
            className={css.submitBtn}
            onClick={handleSubmit}
            disabled={selectedAnswers.every((ans) => ans.length === 0)}
          >
            Submit Answers
          </button>
        )}

        {submitted && (
          <>
            <p className={css.score}>
              You scored: {scorePercent?.toFixed(0)}% correct answers
            </p>
            <button className={css.retryBtn} onClick={handleRetry}>
              Try Again
            </button>
          </>
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
