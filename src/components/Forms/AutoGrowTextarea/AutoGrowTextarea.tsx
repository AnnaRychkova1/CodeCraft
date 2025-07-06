import { useRef, useEffect } from "react";
import type { TextAreaProps } from "@/types/types";
import css from "./autoGrowTextarea.module.css";

export default function AutoGrowTextarea({
  value,
  className,
  ...props
}: TextAreaProps) {
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
      className={`${css.autoGrowTextarea} ${className ?? ""}`}
    />
  );
}
