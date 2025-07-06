import { TextareaHTMLAttributes } from "react";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface ConfirmConfig {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ConfirmContextType {
  confirm: (config: ConfirmConfig) => void;
}

export interface ApiResponseMessage {
  message: string;
  id?: string;
}

export interface FeedbackData {
  email: string;
  feedback: string;
}
