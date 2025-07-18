import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { sendFeedback } from "@/services/feedback";
import Loader from "@/components/Loader/Loader";
import css from "./FeedbackForm.module.css";

const AutoGrowTextarea = dynamic(
  () => import("../AutoGrowTextarea/AutoGrowTextarea"),
);

export default function FeedbackForm() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    email: "",
    feedback: "",
  });
  const [errors, setErrors] = useState<{ email?: string; feedback?: string }>(
    {}
  );
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const validations = {
    email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    feedback: (value: string) => value.trim() !== "",
  };

  const errorMessages = {
    email: {
      required: "Email is required.",
      invalid: "Enter a valid email address.",
    },
    feedback: "Message is required.",
  };

  useEffect(() => {
    setErrors({});
    setStatus("idle");
  }, [pathname]);

  const validateField = (name: string, value: string): boolean => {
    const trimmedValue = value.trim();

    if (name === "email") {
      if (trimmedValue === "") {
        setErrors((prev) => ({
          ...prev,
          email: errorMessages.email.required,
        }));
        return false;
      } else if (!validations.email(trimmedValue)) {
        setErrors((prev) => ({
          ...prev,
          email: errorMessages.email.invalid,
        }));
        return false;
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
        return true;
      }
    }

    if (name === "feedback") {
      if (trimmedValue === "") {
        setErrors((prev) => ({ ...prev, feedback: errorMessages.feedback }));
        return false;
      } else {
        setErrors((prev) => ({ ...prev, feedback: "" }));
        return true;
      }
    }

    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validFields = ["email", "feedback"];
    const allValid = validFields.every((field) =>
      validateField(field, formData[field as keyof typeof formData])
    );

    if (!allValid) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    setStatus("sending");

    try {
      await sendFeedback(formData);
      setStatus("success");
      setFormData({ email: "", feedback: "" });
      toast.success("Thanks a lot! Every bit of feedback helps us improve!");
      setErrors({});
    } catch (err: unknown) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "An unexpected error occurred during sending your feedback"
      );
      setStatus("error");
    }
  };

  return (
    <div className={css.formWrapper}>
      {status === "sending" && (
        <div className={css.loaderOverlay}>
          <Loader />
        </div>
      )}
      <form
        className={css.feedbackBox}
        onSubmit={handleSubmit}
        noValidate
        id="feedbackForm"
      >
        <label htmlFor="feedback">
          Have feedback? Let&rsquo;s make CodeCraft better together.
        </label>
        <div className={css.inputContainer}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={css.formEmail}
            autoComplete="off"
            onFocus={handleFocus}
          />
          {errors.email && (
            <p className={css.error} id="email-error">
              {errors.email}
            </p>
          )}
        </div>
        <div className={css.inputContainer}>
          <AutoGrowTextarea
            id="feedback"
            name="feedback"
            rows={6}
            placeholder="Your Feedback"
            value={formData.feedback}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={css.formMessage}
            onFocus={handleFocus}
          ></AutoGrowTextarea>
          {errors.feedback && (
            <p className={css.error} id="feedback-error">
              {errors.feedback}
            </p>
          )}
        </div>

        <div className={css.btnContainer}>
          <button
            type="submit"
            disabled={status === "sending"}
            className={css.sendBtn}
            form="feedbackForm"
          >
            {status === "sending" ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
