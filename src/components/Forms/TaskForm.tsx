import { v4 as uuidv4 } from "uuid";

import { CodeTask, Question, TaskFormProps } from "@/types/types";
import AutoGrowTextarea from "./AutoGrowTextarea";
import css from "./taskform.module.css";
import TheoryInputs from "./TheoryInputs";
import PracticeInputs from "./PracticeInputs";

export default function TaskForm({
  formData,
  setFormData,
  editId,
  setEditId,
  emptyQuestion,
  emptyCodeTask,
  fetchTasks,
}: TaskFormProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/task/${editId}` : "/api/tasks";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({
      title: "",
      description: "",
      level: "beginner",
      language: "javascript",
      type: "theory",
      theory_question: [structuredClone(emptyQuestion())],
      code_task: [structuredClone(emptyCodeTask())],
    });
    setEditId(null);
    fetchTasks();
  };

  return (
    <form onSubmit={handleSubmit} className={css.taskForm}>
      <div className={css.formContent}>
        <AutoGrowTextarea
          name="title"
          aria-label="Title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          rows={1}
          required
        />

        <AutoGrowTextarea
          name="description"
          aria-label="Description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={2}
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
        {editId ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
}
