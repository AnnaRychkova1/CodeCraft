"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import css from "./theoryquiz.module.css";
import { TheoryQuizProps } from "@/types/types";

const isMultipleAnswer = (
  correctAnswer: string | string[]
): correctAnswer is string[] => Array.isArray(correctAnswer);

export default function TheoryQuiz({ questions }: TheoryQuizProps) {
  // User's selected answers: either string or array of strings per question
  const [selectedAnswers, setSelectedAnswers] = useState<(string | string[])[]>(
    []
  );
  // Whether the quiz was submitted
  const [submitted, setSubmitted] = useState(false);
  // Percentage of correct answers
  const [scorePercent, setScorePercent] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  // Handle selecting answers (radio or checkbox)
  const handleSelect = (index: number, answer: string, isMulti: boolean) => {
    // Do not allow changes after submission
    if (submitted) return;

    setSelectedAnswers((prev) => {
      const updated = [...prev];
      if (isMulti) {
        const current = Array.isArray(updated[index])
          ? [...(updated[index] as string[])]
          : [];
        if (current.includes(answer)) {
          updated[index] = current.filter((a) => a !== answer);
        } else {
          updated[index] = [...current, answer];
        }
      } else {
        updated[index] = answer;
      }
      return updated;
    });
  };

  // Check answers and calculate score
  const handleSubmit = () => {
    let correctCount = 0;

    questions.forEach((q, i) => {
      const multi = isMultipleAnswer(q.correctAnswer);
      const userAnswer = selectedAnswers[i];

      if (multi) {
        // If user's answers match correct answers exactly (order doesn't matter)
        if (
          Array.isArray(userAnswer) &&
          userAnswer.length === q.correctAnswer.length &&
          userAnswer.every((ans) => (q.correctAnswer as string[]).includes(ans))
        ) {
          correctCount++;
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    const percent = (correctCount / questions.length) * 100;
    setScorePercent(percent);
    setSubmitted(true);

    // Show confetti only if 100% correct
    if (percent === 100) {
      setShowConfetti(true);
    }
  };

  // Reset quiz state for retry
  const handleRetry = () => {
    setSelectedAnswers([]);
    setSubmitted(false);
    setScorePercent(null);
    setConfettiVisible(false);
  };

  // Helper to determine option styling after submission
  const getOptionClass = (
    questionIndex: number,
    option: string
  ): string | undefined => {
    if (!submitted) return;

    const question = questions[questionIndex];
    const multi = isMultipleAnswer(question.correctAnswer);
    const correctAnswers = multi
      ? Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : []
      : typeof question.correctAnswer === "string"
      ? [question.correctAnswer]
      : [];
    const userAnswer = selectedAnswers[questionIndex];

    const isSelected = multi
      ? Array.isArray(userAnswer) && userAnswer.includes(option)
      : userAnswer === option;

    const isCorrect = correctAnswers.includes(option);

    if (isSelected && isCorrect) return css.correct;
    if (isSelected && !isCorrect) return css.incorrect;
    if (!isSelected && isCorrect) return css.correct;
    if (!isSelected && isCorrect && multi) return css.correct;

    return undefined;
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
    <section className={css.quizContainer}>
      <h3>Theory Quiz</h3>
      <ol className={css.questionList}>
        {questions.map((q, i) => {
          const multi = isMultipleAnswer(q.correctAnswer);
          const selected = selectedAnswers[i];

          return (
            <li key={i}>
              <p className={css.question}>{q.question}</p>
              <ul className={css.options}>
                {q.options.map((opt) => {
                  const checked = multi
                    ? Array.isArray(selected) && selected.includes(opt)
                    : selected === opt;
                  const optionClass = getOptionClass(i, opt);

                  return (
                    <li key={opt}>
                      <label className={css.optionLabel}>
                        <input
                          type={multi ? "checkbox" : "radio"}
                          name={`question-${i}`}
                          value={opt}
                          checked={checked}
                          onChange={() => handleSelect(i, opt, multi)}
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

      {/* Buttons and result */}
      {!submitted && (
        <button
          className={css.submitBtn}
          onClick={handleSubmit}
          disabled={selectedAnswers.length === 0}
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
      {/* Confetti overlay */}
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
