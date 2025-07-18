"use client";

import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import type { UserProgressModalProps } from "@/types/userTypes";
import { fetchUserProgress } from "@/services/tasks";
import animationData from "@/assets/animations/coder.json";
import Loader from "@/components/Loader/Loader";
import css from "./UserProgressModal.module.css";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const COLORS = ["#117912", "#66e665"];

export default function UserProgressModal({
  isOpen,
  onClose,
}: UserProgressModalProps) {
  const [userTaskCount, setUserTaskCount] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [theoretical, setTheoretical] = useState(0);
  const [practical, setPractical] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    const fetchProgress = async () => {
      setLoadingProgress(true);
      try {
        const progress = await fetchUserProgress();
        const allTasks = progress.allTasks;
        const doneTasks = progress.doneTasks;
        const theory = progress.theory;
        const practice = progress.practice;
        setTotalTasks(allTasks);
        setUserTaskCount(doneTasks);
        setTheoretical(theory);
        setPractical(practice);
      } catch (err) {
        toast.error(`${err instanceof Error ? err.message : String(err)}`);

        const message =
          err instanceof Error ? err.message : "Failed to fetch your progress.";
        if (message === "Your session has expired. Please log in again.") {
          signOut();
        }
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchProgress();
  }, [isOpen, isAuthenticated]);

  const progressPercent = Math.round((userTaskCount / totalTasks) * 100);
  const chartData = [
    { name: "Theoretical", value: theoretical },
    { name: "Practical", value: practical },
  ];

  return (
    <Transition show={isOpen}>
      <Dialog as="div" className={css.modalRoot} onClose={onClose}>
        <div className={css.modalWrapper}>
          <div className={css.modalBackdrop}>
            <TransitionChild
              as={DialogPanel}
              enter={css.modalEnter}
              enterFrom={css.modalEnterFrom}
              enterTo={css.modalEnterTo}
              leave={css.modalLeave}
              leaveFrom={css.modalLeaveFrom}
              leaveTo={css.modalLeaveTo}
            >
              {userTaskCount === 0 ? (
                <div className={css.modalContent}>
                  <div>
                    <h2 className="title">{`Welcome, ${session?.user?.name}!`}</h2>
                    <p className={css.welcomMessage}>
                      Great to have you here! Complete your first task to start
                      tracking progress.
                    </p>
                  </div>
                  <Lottie animationData={animationData} loop={true} />
                  <button
                    onClick={onClose}
                    className={`loginBtn ${css.closeBtn}`}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className={css.modalContent}>
                  <h2 className="title">{`Great job, ${session?.user?.name}!`}</h2>
                  {loadingProgress ? (
                    <Loader />
                  ) : (
                    <>
                      <p
                        className={css.progressMessage}
                      >{`You've completed ${progressPercent}% of the course`}</p>

                      <PieChart width={300} height={300}>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                          dataKey="value"
                        >
                          {chartData.map((_, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </>
                  )}

                  <button
                    onClick={onClose}
                    className={`loginBtn ${css.closeBtn}`}
                  >
                    Close
                  </button>
                </div>
              )}
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
