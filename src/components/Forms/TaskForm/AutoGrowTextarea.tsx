import { useRef, useEffect } from "react";
import css from "./taskform.module.css";
import { PropsTextArea } from "@/types/types";

export default function AutoGrowTextarea({
  value,
  className,
  ...props
}: PropsTextArea) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      {...props}
      value={value}
      ref={ref}
      onInput={() => {
        if (ref.current) {
          ref.current.style.height = "auto";
          ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
      }}
      className={`${css.taskTextarea} ${className ?? ""}`}
    />
  );
}
