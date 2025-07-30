"use client";
import dynamic from "next/dynamic";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import type { TheoryTestProps } from "@/types/tasksTypes";
import { submitUserTaskResult } from "@/services/tasks";
import Loader from "@/components/Loader/Loader";
import css from "./TheoryTest.module.css";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const isMultipleAnswer = (correctAnswer: string[]): boolean =>
  correctAnswer.length > 1;

export default function TheoryTest({
  theoryQuestions,
  taskId,
  result,
}: TheoryTestProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>(
    Array(theoryQuestions.length).fill([])
  );
  const [submitted, setSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const { data: session, status } = useSession();
  const userName = session?.user?.name;
  const isAuthenticated = status === "authenticated";

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

  const handleSelect = (index: number, answer: string, isMulti: boolean) => {
    if (submitted || loading) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

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

  const handleSubmit = async () => {
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

    if (isAuthenticated) {
      setLoading(true);
      try {
        const response = await submitUserTaskResult(taskId, {
          result: percent,
          submitted: true,
        });

        if (response?.message) {
          toast.success(response.message);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);

        toast.error(errorMessage || "Failed to save result to server.");
        if (errorMessage === "Your session has expired. Please log in again.") {
          signOut();
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRetry = () => {
    if (loading) return;
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

  return (
    <section className={css.theorySection}>
      <div className={css.theoryContainer}>
        <h3>Theory Test</h3>
        {isAuthenticated && result && (
          <div
            className={`${css.solvedContainer} ${hasStarted ? css.hidden : ""}`}
          >
            <p className={css.helperText}>
              <span className={css.helperName}>Hi, {userName}!</span>{" "}
              {result === 100
                ? "Congrats! You previously submitted a perfect solution. Feel free to review or improve it further!"
                : `You previously submitted a solution with a score of ${Math.round(
                    result
                  )}%. You can update it and try to improve.`}
            </p>
          </div>
        )}
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
            {loading ? "Submitting..." : "Submit Answers"}
          </button>
        )}

        {submitted && (
          <>
            {loading && (
              <div className={css.loaderWrapper}>
                <Loader />
              </div>
            )}
            <p className={css.score}>
              You scored: {scorePercent?.toFixed(0)}% correct answers
            </p>
            <button
              className={css.retryBtn}
              onClick={handleRetry}
              disabled={loading}
            >
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
