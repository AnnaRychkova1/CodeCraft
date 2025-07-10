"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import type { ConfirmConfig, ConfirmContextType } from "@/types/commonTypes";
import css from "./ConfirmModal.module.css";

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context)
    throw new Error("useConfirm must be used within ConfirmProvider");
  return context.confirm;
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmConfig | null>(null);
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const confirm = (newConfig: ConfirmConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
    setTimeout(() => setVisible(true), 10);
  };

  const close = () => {
    setVisible(false);
    setTimeout(() => {
      setConfig(null);
    }, 200);
  };

  const handleConfirm = () => {
    config?.onConfirm?.();

    close();
  };

  const handleCancel = () => {
    config?.onCancel?.();

    close();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && config && (
        <div className={`${css.modalBackdrop} ${visible ? css.visible : ""}`}>
          <div
            ref={modalRef}
            className={`${css.modal} ${
              visible ? css.modalEnterActive : css.modalEnter
            }`}
          >
            <p>{config.message}</p>
            <div className={css.modalActions}>
              <button onClick={handleConfirm}>Yes</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
