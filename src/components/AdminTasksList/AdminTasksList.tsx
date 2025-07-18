import { toast } from "react-hot-toast";
import { useState } from "react";
import { MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { FaJava, FaBookOpen } from "react-icons/fa";
import { GiHammerBreak } from "react-icons/gi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { AdminTasksListProps } from "@/types/adminTypes";
import { deleteTask } from "@/services/tasks";
import { useAdminAuth } from "../Providers/AdminAuthProvider";
import { useConfirm } from "@/components/Modals/ConfirmModal/ConfirmModal";
import css from "./AdminTasksList.module.css";

export default function AdminTasksList({
  tasks,
  handleEdit,
  loadTasks,
}: AdminTasksListProps) {
  const confirm = useConfirm();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const { setIsAdminVerified } = useAdminAuth();

  const handleDelete = async (id: string) => {
    confirm({
      message: "Are you sure you want to delete this task?",
      onConfirm: async () => {
        setDeletingTaskId(id);
        try {
          await deleteTask(id);
          toast.success("Task deleted successfully");
          await loadTasks();
        } catch (err) {
          toast.error(`${err instanceof Error ? err.message : String(err)}`);
          const message =
            err instanceof Error ? err.message : "Failed to delete task.";
          if (message === "Token expired. Please log in again.") {
            setIsAdminVerified(false);
          }
        } finally {
          setDeletingTaskId(null);
        }
      },
    });
  };

  return (
    <ul className={css.tasksList}>
      {tasks.map((task) => (
        <li key={task.id} className={css.task}>
          <div className={css.taskInfo}>
            <h3>{task.title}</h3>
            <div className={css.labelContainer}>
              <span className={css.iconBox}>
                {
                  {
                    beginner: <MdLooksOne className={css.levelBeginner} />,
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
                    practice: <GiHammerBreak className={css.typePractice} />,
                  }[task.type]
                }
              </span>
            </div>
          </div>
          <div className={css.buttonContainer}>
            <button onClick={() => handleEdit(task.id)} className={css.editBtn}>
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
  );
}
