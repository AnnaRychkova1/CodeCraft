"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { ConfirmConfig, ConfirmContextType } from "@/types/commonTypes";
import css from "./confirmModal.module.css";

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

  const confirm = (newConfig: ConfirmConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    config?.onConfirm?.();
    setIsOpen(false);
  };

  const handleCancel = () => {
    config?.onCancel?.();
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && config && (
        <div className={css.modalBackdrop}>
          <div className={css.modal}>
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
