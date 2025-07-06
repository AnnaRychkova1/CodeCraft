import TheoryInputs from "./TheoryInputs";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { CodeTask, Question, TaskFormProps } from "@/types/tasksTypes";
import { createTask, updateTask } from "@/services/tasks";
import Loader from "@/components/Loader/Loader";
import PracticeInputs from "./PracticeInputs";
import AutoGrowTextarea from "../AutoGrowTextarea/AutoGrowTextarea";
import css from "./TaskForm.module.css";

export default function TaskForm({
  formData,
  setFormData,
  editId,
  setEditId,
  emptyQuestion,
  emptyCodeTask,
  onSubmitSuccess,
  cancelEdit,
}: TaskFormProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      if (value === "theory") {
        setFormData((prev) => ({
          ...prev,
          type: value,
          theory_question: [structuredClone(emptyQuestion())],
          code_task: [structuredClone(emptyCodeTask())],
        }));
      } else if (value === "practice") {
        setFormData((prev) => ({
          ...prev,
          type: value,
          code_task: [structuredClone(emptyCodeTask())],
          theory_question: [structuredClone(emptyQuestion())],
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuestionChange = (
    index: number,
    key: keyof Question,
    value: string | string[]
  ) => {
    const updated = [...(formData.theory_question || [])];
    updated[index] = { ...updated[index], [key]: value };
    setFormData((prev) => ({ ...prev, theory_question: updated }));
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updated = [...(formData.theory_question || [])];
    updated[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, theory_question: updated }));
  };

  const handleOptionRemove = (qIndex: number, oIndex: number) => {
    const updated = [...(formData.theory_question || [])];
    updated[qIndex].options.splice(oIndex, 1);
    setFormData((prev) => ({ ...prev, theory_question: updated }));
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      theory_question: [
        ...(prev.theory_question || []),
        structuredClone({ ...emptyQuestion(), id: uuidv4() }),
      ],
    }));
  };

  const handleQuestionRemove = (index: number) => {
    const updated = [...(formData.theory_question || [])];
    updated.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      theory_question: updated,
    }));
  };

  const handleCodeTaskChange = <K extends keyof CodeTask>(
    index: number,
    key: K,
    value: CodeTask[K]
  ) => {
    setFormData((prev) => {
      const updatedCodeTasks = [...(prev.code_task || [])];
      updatedCodeTasks[index] = {
        ...(updatedCodeTasks[index] ?? {
          prompt: "",
          starter_code: "",
          test_case: [],
        }),
        [key]: value,
      };
      return { ...prev, code_task: updatedCodeTasks };
    });
  };

  const handleTestChange = (
    taskIndex: number,
    testIndex: number,
    updatedTest: { input: unknown[]; expected: unknown }
  ) => {
    setFormData((prev) => {
      const updatedCodeTasks = [...(prev.code_task || [])];
      const updatedTests = [...(updatedCodeTasks[taskIndex]?.test_case || [])];
      updatedTests[testIndex] = updatedTest;
      updatedCodeTasks[taskIndex] = {
        ...updatedCodeTasks[taskIndex],
        test_case: updatedTests,
      };
      return { ...prev, code_task: updatedCodeTasks };
    });
  };

  const handleTestRemove = (taskIndex: number, testIndex: number) => {
    setFormData((prev) => {
      const updatedCodeTasks = [...(prev.code_task || [])];
      const updatedTests = [...(updatedCodeTasks[taskIndex]?.test_case || [])];
      updatedTests.splice(testIndex, 1);
      updatedCodeTasks[taskIndex] = {
        ...updatedCodeTasks[taskIndex],
        test_case: updatedTests,
      };
      return { ...prev, code_task: updatedCodeTasks };
    });
  };

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      level: "beginner",
      language: "javascript",
      type: "theory",
      theory_question: [structuredClone(emptyQuestion())],
      code_task: [structuredClone(emptyCodeTask())],
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (formData.type === "theory") {
      if (!formData.theory_question || formData.theory_question.length === 0) {
        toast.error("At least one theory question is required");
        return false;
      }

      for (const [index, q] of formData.theory_question.entries()) {
        if (!q.question.trim()) {
          toast.error(`Question ${index + 1} is missing text`);
          return false;
        }

        if (!Array.isArray(q.options) || q.options.length < 2) {
          toast.error(`Question ${index + 1} must have at least 2 options`);
          return false;
        }

        if (q.options.some((opt) => !opt.trim())) {
          toast.error(`Question ${index + 1} contains an empty option`);
          return false;
        }

        if (
          !Array.isArray(q.correct_answer) ||
          q.correct_answer.length === 0 ||
          q.correct_answer.every((ans) => !ans.trim())
        ) {
          toast.error(
            `Question ${index + 1} must have at least one valid correct answer`
          );
          return false;
        }

        const invalidCorrectAnswers = q.correct_answer.filter(
          (ans) => !q.options.includes(ans.trim())
        );
        if (invalidCorrectAnswers.length > 0) {
          toast.error(
            `Correct answer(s) in question ${
              index + 1
            } must match available options`
          );
          return false;
        }
      }
    }

    if (formData.type === "practice") {
      if (!formData.code_task || formData.code_task.length === 0) {
        toast.error("At least one practice task is required");
        return false;
      }

      for (const [index, task] of formData.code_task.entries()) {
        if (!task.prompt?.trim()) {
          toast.error(`Practice task ${index + 1} needs a prompt`);
          return false;
        }

        if (!task.starter_code?.trim()) {
          toast.error(`Practice task ${index + 1} needs starter code`);
          return false;
        }

        if (!Array.isArray(task.test_case) || task.test_case.length === 0) {
          toast.error(
            `Practice task ${index + 1} must have at least one test case`
          );
          return false;
        }

        for (const [testIndex, test] of task.test_case.entries()) {
          if (
            !Array.isArray(test.input) ||
            test.input.length === 0 ||
            test.input.every((val) => val === "" || val === null)
          ) {
            toast.error(
              `Test case ${testIndex + 1} in task ${
                index + 1
              } has invalid or empty input (must be JSON array)`
            );
            return false;
          }

          if (
            typeof test.expected === "undefined" ||
            test.expected === null ||
            (typeof test.expected === "string" && test.expected.trim() === "")
          ) {
            toast.error(
              `Test case ${testIndex + 1} in task ${
                index + 1
              } is missing expected output`
            );
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      if (editId) {
        await updateTask(editId, formData);
        toast.success("Task updated successfully");
      } else {
        await createTask(formData);
        toast.success("Task created successfully");
      }

      clearForm();

      setEditId(null);

      if (onSubmitSuccess) {
        await onSubmitSuccess();
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "An unexpected error occurred during sending the task."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className={css.formWrapper}>
      {loading && (
        <div className={css.loaderOverlay}>
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className={css.taskForm} noValidate>
        <div className={css.formContent}>
          <AutoGrowTextarea
            name="title"
            aria-label="Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            rows={1}
          />

          <AutoGrowTextarea
            name="description"
            aria-label="Description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={2}
            required
          />
          <div className={css.selectContainer}>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={css.select}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={css.select}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={css.select}
            >
              <option value="theory">Theory</option>
              <option value="practice">Practice</option>
            </select>
          </div>

          {formData.type === "theory" && (
            <TheoryInputs
              questions={formData.theory_question || []}
              onChange={handleQuestionChange}
              onOptionChange={handleOptionChange}
              onOptionRemove={handleOptionRemove}
              onQuestionRemove={handleQuestionRemove}
              onAddQuestion={handleAddQuestion}
              setQuestions={(newQuestions) =>
                setFormData((prev) => ({
                  ...prev,
                  theory_question: newQuestions,
                }))
              }
            />
          )}

          {formData.type === "practice" &&
            formData.code_task?.map((codeTaskItem, idx) => (
              <PracticeInputs
                key={idx}
                code_task={codeTaskItem}
                onChange={(key, value) => handleCodeTaskChange(idx, key, value)}
                onTestChange={(testIndex, updatedTest) =>
                  handleTestChange(idx, testIndex, updatedTest)
                }
                onTestRemove={(testIndex) => handleTestRemove(idx, testIndex)}
              />
            ))}
        </div>

        <button type="submit" className={css.createUpdateBtn}>
          {loading ? "Saving..." : editId ? "Update Task" : "Create Task"}
        </button>
        {editId ? (
          <button onClick={cancelEdit} className={css.cancelBtn} type="button">
            Cancel Edit
          </button>
        ) : (
          <button onClick={clearForm} className={css.cancelBtn} type="button">
            Clear Form
          </button>
        )}
      </form>
    </div>
  );
}
