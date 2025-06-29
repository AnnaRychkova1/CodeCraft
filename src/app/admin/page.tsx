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
import css from "./pageAdmin.module.css";
import { createAdminToken, deleteTask, fetchTasks } from "@/services/tasks";

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
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    level: "beginner",
    language: "javascript",
    type: "theory",
    theory_question: [createEmptyQuestion()],
    code_task: [createEmptyCodeTask()],
  });
  const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter();

  const loadTasks = async () => {
    try {
      const updated = await fetchTasks();
      setTasks(updated);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadTasks();
    }
  }, [isAdmin]);

  const handleEdit = (task: Task) => {
    setEditId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      level: task.level,
      language: task.language,
      type: task.type,
      theory_question: task.theory_question?.length
        ? task.theory_question
        : [createEmptyQuestion()],
      code_task: task.code_task?.length
        ? task.code_task
        : [createEmptyCodeTask()],
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      const updated = await fetchTasks();
      setTasks(updated);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const token = await createAdminToken(password);
      localStorage.setItem("adminToken", token);
      setIsAdmin(true);
      setPassword("");
    } catch (err) {
      alert("Wrong password or error. Try again...");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    setPassword("");
    setEditId(null);
    router.push("/");
  };

  if (!isAdmin) {
    return (
      <section className={css.sectionLogin}>
        <h2 className={css.title}>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={css.adminInput}
        />
        <div className={css.buttonLoginContainer}>
          <button onClick={handleLogin} className={css.loginBtn}>
            Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={css.section}>
      <button
        onClick={handleLogout}
        className={`${css.logoutBtn} ${css.loginBtn}`}
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
        />
      </div>

      <div>
        <h2 className={css.title}>Tasks</h2>
        <ul className={css.tasksList}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
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
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className={css.noResult}>No tasks yet.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
