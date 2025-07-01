"use client";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { FaJava, FaBookOpen } from "react-icons/fa";
import { GiHammerBreak } from "react-icons/gi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { CodeTask, Question, Task } from "@/types/types";
import TaskForm from "@/components/Forms/TaskForm";
import Loader from "@/components/Loader/Loader";
import { toast } from "react-hot-toast";
import css from "./pageAdmin.module.css";
import {
  deleteTask,
  fetchTaskById,
  fetchTasks,
  getAdminAccess,
  verifyAdminToken,
} from "@/services/tasks";

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

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
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

  const router = useRouter();

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

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setSessionExpired(false);
        return;
      }

      try {
        const isValid = await verifyAdminToken(token);
        if (isValid) {
          setIsAdmin(true);
          setSessionExpired(false);
        } else {
          localStorage.removeItem("adminToken");
          setIsAdmin(false);
          setSessionExpired(true);
          toast.error("Session expired. Please login again.");
        }
      } catch (err: unknown) {
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
        setSessionExpired(true);
        toast.error(
          `Error verifying session. Please login again. ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (isAdmin && !sessionExpired) {
      loadTasks();
    }
  }, [isAdmin, sessionExpired]);

  const handleEdit = async (task: Task) => {
    try {
      const fullTask = await fetchTaskById(task.id);
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

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    setDeletingTaskId(id);
    try {
      await deleteTask(id);
      toast.success("Task deleted successfully");
      await loadTasks();
    } catch (err) {
      toast.error(
        `Failed to delete task: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleAccess = async () => {
    setLoggingIn(true);
    try {
      const token = await getAdminAccess(password);
      localStorage.setItem("adminToken", token);
      setIsAdmin(true);
      setPassword("");
      toast.success("Admin access granted");
    } catch (err) {
      toast.error(`${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogoutAdmin = () => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    setPassword("");
    setEditId(null);
    toast.success("Logged out successfully");

    router.push("/");
  };

  if (!isAdmin) {
    return (
      <section className={css.sectionAccess}>
        <h2 className={css.title}>Admin Access</h2>
        {sessionExpired && (
          <p className={css.expiredWarning}>
            Session expired. Please login again.
          </p>
        )}
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={css.adminInput}
        />
        {loggingIn ? (
          <Loader />
        ) : (
          <div className={css.buttonAccessContainer}>
            <button
              onClick={handleAccess}
              className={css.accessBtn}
              disabled={loggingIn}
            >
              Get Access
            </button>
          </div>
        )}
      </section>
    );
  }
  return (
    <section className={css.section}>
      <button
        onClick={handleLogoutAdmin}
        className={`${css.logoutBtn} ${css.accessBtn}`}
      >
        Logout
      </button>

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
          <ul className={css.tasksList}>
            {tasks.map((task) => (
              <li key={task.id} className={css.task}>
                <div className={css.taskInfo}>
                  <h3>{task.title}</h3>
                  <div className={css.labelContainer}>
                    <span className={css.iconBox}>
                      {
                        {
                          beginner: (
                            <MdLooksOne className={css.levelBeginner} />
                          ),
                          intermediate: (
                            <MdLooksTwo className={css.levelIntermediate} />
                          ),
                          advanced: <MdLooks3 className={css.levelAdvanced} />,
                        }[task.level]
                      }
                    </span>
                    <span className={css.iconBox}>
                      {
                        {
                          python: <SiPython className={css.languagePython} />,
                          java: <FaJava className={css.languageJava} />,
                          javascript: (
                            <SiJavascript className={css.languageJavascript} />
                          ),
                        }[task.language]
                      }
                    </span>
                    <span className={css.iconBox}>
                      {
                        {
                          theory: <FaBookOpen className={css.typeTheory} />,
                          practice: (
                            <GiHammerBreak className={css.typePractice} />
                          ),
                        }[task.type]
                      }
                    </span>
                  </div>
                </div>
                <div className={css.buttonContainer}>
                  <button
                    onClick={() => handleEdit(task)}
                    className={css.editBtn}
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className={css.deleteBtn}
                    disabled={deletingTaskId === task.id}
                  >
                    {deletingTaskId === task.id ? (
                      "Deleting..."
                    ) : (
                      <FiTrash2 size={20} />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={css.noResult}>No tasks yet.</div>
        )}
      </div>
    </section>
  );
}
