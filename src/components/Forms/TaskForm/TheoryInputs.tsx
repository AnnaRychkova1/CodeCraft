import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { TheoryInputsProps } from "@/types/tasksTypes";
import AutoGrowTextarea from "../AutoGrowTextarea/AutoGrowTextarea";
import css from "./taskForm.module.css";

export default function TheoryInputs({
  questions,
  onChange,
  onOptionChange,
  onOptionRemove,
  onQuestionRemove,
  onAddQuestion,
  setQuestions,
}: TheoryInputsProps) {
  return (
    <div className={css.typeContainer}>
      <h3 className={css.typeTitle}>Theory Questions</h3>
      {questions.map((q, index) => (
        <ul key={q.id} className={css.questionsContainer}>
          <li className={css.questionWrapper}>
            <div className={css.questionTitleBox}>
              <p className={`${css.questionTitle} ${css.highlight}`}>
                Question
              </p>
              <button
                type="button"
                onClick={() => onQuestionRemove(index, q.id)}
                className={css.deleteQuestionBtn}
              >
                <FiTrash2 />
                <span>Delete Question</span>
              </button>
            </div>
            <AutoGrowTextarea
              value={q.question}
              aria-label={`Question ${index + 1}`}
              name={`question-${index}`}
              onChange={(e) => onChange(index, "question", e.target.value)}
              placeholder="Question"
              rows={1}
            />
            <p className={css.questionTitle}>Answer Options</p>
            {q.options.map((opt, i) => (
              <div key={`option-${i}`} className={css.questionHandlerBox}>
                <AutoGrowTextarea
                  value={opt}
                  aria-label={`Option ${i + 1} for question ${index + 1}`}
                  name={`option-${index}-${i}`}
                  onChange={(e) => onOptionChange(index, i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  rows={1}
                  className={css.questionOptin}
                />
                <button
                  type="button"
                  onClick={() => onOptionRemove(index, i)}
                  className={css.deleteBtn}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const updated = [...questions];
                updated[index].options.push("");
                setQuestions(updated);
              }}
              className={css.addBtn}
            >
              <FiPlus /> Add Option
            </button>

            <p className={css.questionTitle}>Correct answer</p>
            {(q.correct_answer.length > 0 ? q.correct_answer : [""]).map(
              (answer, aIndex) => (
                <div
                  key={`correct-${aIndex}`}
                  className={css.questionHandlerBox}
                >
                  <AutoGrowTextarea
                    value={answer}
                    onChange={(e) => {
                      const updatedAnswers = [...q.correct_answer];
                      updatedAnswers[aIndex] = e.target.value;
                      onChange(index, "correct_answer", updatedAnswers);
                    }}
                    placeholder={`Correct Answer ${aIndex + 1}`}
                    rows={1}
                  />
                  {q.correct_answer.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = q.correct_answer.filter(
                          (_, i) => i !== aIndex
                        );
                        onChange(index, "correct_answer", updated);
                      }}
                      className={css.deleteBtn}
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              )
            )}

            <button
              type="button"
              onClick={() => {
                onChange(index, "correct_answer", [...q.correct_answer, ""]);
              }}
              className={css.addBtn}
            >
              <FiPlus /> Add more correct answer
            </button>
          </li>
        </ul>
      ))}
      <div className={css.btnContainer}>
        <button
          type="button"
          onClick={onAddQuestion}
          className={css.addQuestionBtn}
        >
          <FiPlus /> Add Question
        </button>
      </div>
    </div>
  );
}
