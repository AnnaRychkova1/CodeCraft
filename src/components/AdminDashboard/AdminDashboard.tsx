import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CodeTask, Question, Task } from "@/types/tasksTypes";
import type { AdminDashboardProps } from "@/types/adminTypes";
import { fetchTaskById, fetchTasks } from "@/services/tasks";
import { removeAdminAccess } from "@/services/admin";
import { useAdminAuth } from "@/components/Providers/AdminAuthProvider";
import { useConfirm } from "@/components/Modals/ConfirmModal/ConfirmModal";
import TaskForm from "@/components/Forms/TaskForm/TaskForm";
import AdminTasksList from "@/components/AdminTasksList/AdminTasksList";
import Loader from "@/components/Loader/Loader";
import css from "./adminDashboard.module.css";

const emptyQuestionTemplate = {
  question: "",
  options: ["", ""],
  correct_answer: [""],
};

const emptyCodeTaskTemplate = {
  prompt: "",
  starter_code: "",
  test_case: [],
};

const createEmptyQuestion = (): Question => ({
  id: uuidv4(),
  ...structuredClone(emptyQuestionTemplate),
});

const createEmptyCodeTask = (): CodeTask => ({
  id: uuidv4(),
  ...structuredClone(emptyCodeTaskTemplate),
});

export default function AdminDashboard({
  sessionExpired,
}: AdminDashboardProps) {
  const confirm = useConfirm();
  const { logoutAdmin, adminToken } = useAdminAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    level: "beginner",
    language: "javascript",
    type: "theory",
    theory_question: [createEmptyQuestion()],
    code_task: [createEmptyCodeTask()],
  });

  useEffect(() => {
    if (adminToken && !sessionExpired) {
      loadTasks();
    }
  }, [adminToken, sessionExpired]);

  const loadTasks = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const updated = await fetchTasks();
      setTasks(updated);
    } catch (err: unknown) {
      toast.error(`${err instanceof Error ? err.message : String(err)}`);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (sessionExpired) {
      toast.error("Session expired. Please login again.");
      return;
    }
    try {
      const fullTask = await fetchTaskById(id);

      setEditId(fullTask.id);
      setFormData({
        title: fullTask.title,
        description: fullTask.description,
        level: fullTask.level,
        language: fullTask.language,
        type: fullTask.type,
        theory_question: fullTask.theory_question?.length
          ? fullTask.theory_question
          : [createEmptyQuestion()],
        code_task: fullTask.code_task?.length
          ? fullTask.code_task
          : [createEmptyCodeTask()],
      });
    } catch (err) {
      toast.error(
        `Failed to load task for editing: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      level: "beginner",
      language: "javascript",
      type: "theory",
      theory_question: [createEmptyQuestion()],
      code_task: [createEmptyCodeTask()],
    });
    toast("Edit cancelled", { icon: "✖️" });
  };

  const handleLogoutAdmin = () => {
    confirm({
      message: "Are you sure you want to log out?",
      onConfirm: async () => {
        localStorage.removeItem("adminToken");
        try {
          await removeAdminAccess();
          logoutAdmin();
          setEditId(null);
          toast.success("Logged out successfully");
          localStorage.removeItem("adminToken");
          router.push("/");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to logout");
        }
      },
    });
  };

  return (
    <>
      <button
        onClick={handleLogoutAdmin}
        className={`logoutBtn ${css.accessBtn}`}
      >
        Logout
      </button>
      <section className={css.section}>
        <div>
          <h2 className={css.title}>Admin Task Panel</h2>
          <TaskForm
            formData={formData}
            setFormData={setFormData}
            editId={editId}
            setEditId={setEditId}
            emptyQuestion={createEmptyQuestion}
            emptyCodeTask={createEmptyCodeTask}
            onSubmitSuccess={loadTasks}
            cancelEdit={cancelEdit}
          />
        </div>

        <div>
          <h2 className={css.title}>Tasks</h2>
          {loading ? (
            <Loader />
          ) : loadError ? (
            <div className={css.noResult}>Failed to load tasks.</div>
          ) : tasks.length > 0 ? (
            <AdminTasksList
              tasks={tasks}
              handleEdit={handleEdit}
              loadTasks={loadTasks}
              sessionExpired={sessionExpired}
            />
          ) : (
            <div className={css.noResult}>No tasks yet.</div>
          )}
        </div>
      </section>
    </>
  );
}
