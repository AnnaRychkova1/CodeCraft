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
          theoryQuestions: [structuredClone(emptyQuestion)],
          codeTask: structuredClone(emptyCodeTask),
        }));
      } else if (value === "practice") {
        setFormData((prev) => ({
          ...prev,
          type: value,
          codeTask: structuredClone(emptyCodeTask),
          theoryQuestions: [structuredClone(emptyQuestion)],
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
    const updated = [...(formData.theoryQuestions || [])];
    updated[index] = { ...updated[index], [key]: value };
    setFormData((prev) => ({ ...prev, theoryQuestions: updated }));
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updated = [...(formData.theoryQuestions || [])];
    updated[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, theoryQuestions: updated }));
  };

  const handleOptionRemove = (qIndex: number, oIndex: number) => {
    const updated = [...(formData.theoryQuestions || [])];
    updated[qIndex].options.splice(oIndex, 1); // Видаляємо опцію
    setFormData((prev) => ({ ...prev, theoryQuestions: updated }));
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      theoryQuestions: [
        ...(prev.theoryQuestions || []),
        structuredClone({ ...emptyQuestion, id: uuidv4() }),
      ],
    }));
  };

  const handleCodeTaskChange = <K extends keyof CodeTask>(
    key: K,
    value: CodeTask[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      codeTask: {
        ...(prev.codeTask ?? { prompt: "", starterCode: "", tests: [] }),
        [key]: value,
      },
    }));
  };

  const handleTestChange = (
    index: number,
    updatedTest: { input: unknown[]; expected: unknown }
  ) => {
    const updatedTests = [...(formData.codeTask?.tests || [])];
    updatedTests[index] = updatedTest;
    handleCodeTaskChange("tests", updatedTests);
  };

  const handleTestRemove = (index: number) => {
    const updatedTests = [...(formData.codeTask?.tests || [])];
    updatedTests.splice(index, 1);

    handleCodeTaskChange("tests", updatedTests);
  };

  const handleQuestionRemove = (index: number) => {
    const updated = [...(formData.theoryQuestions || [])];
    updated.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      theoryQuestions: updated,
    }));
  };

  // const handleTestRemove = async (index: number, testId?: string) => {
  //   if (testId) {
  //     try {
  //       const res = await fetch(`/api/testcase/${testId}`, {
  //         method: "DELETE",
  //       });
  //       if (!res.ok) throw new Error("Failed to delete test case");
  //     } catch (error) {
  //       console.error(error);
  //       alert("Error deleting test");
  //       return;
  //     }
  //   }

  //   const updatedTests = [...(formData.codeTask?.tests || [])];
  //   updatedTests.splice(index, 1);
  //   handleCodeTaskChange("tests", updatedTests);
  // };

  // const handleQuestionRemove = async (index: number, questionId?: string) => {
  //   if (questionId) {
  //     try {
  //       const res = await fetch(`/api/theory-question/${questionId}`, {
  //         method: "DELETE",
  //       });
  //       if (!res.ok) throw new Error("Failed to delete theory question");
  //     } catch (error) {
  //       console.error(error);
  //       alert("Error deleting question");
  //       return;
  //     }
  //   }

  //   const updated = [...(formData.theoryQuestions || [])];
  //   updated.splice(index, 1);
  //   setFormData((prev) => ({ ...prev, theoryQuestions: updated }));
  // };

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
      theoryQuestions: [structuredClone(emptyQuestion)],
      codeTask: structuredClone(emptyCodeTask),
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
            questions={formData.theoryQuestions || []}
            onChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onOptionRemove={handleOptionRemove}
            onQuestionRemove={handleQuestionRemove}
            onAddQuestion={handleAddQuestion}
            setQuestions={(newQuestions) =>
              setFormData((prev) => ({
                ...prev,
                theoryQuestions: newQuestions,
              }))
            }
          />
        )}

        {formData.type === "practice" && (
          <PracticeInputs
            codeTask={
              formData.codeTask ?? { prompt: "", starterCode: "", tests: [] }
            }
            onChange={handleCodeTaskChange}
            onTestChange={handleTestChange}
            onTestRemove={handleTestRemove}
          />
        )}
      </div>

      <button type="submit" className={css.createUpdateBtn}>
        {editId ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
}
