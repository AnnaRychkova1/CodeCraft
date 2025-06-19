import { useState } from "react";
import css from "./feedbackform.module.css";

export default function FeedbackForm() {
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

    if (errors[name as keyof typeof errors]) {
      validateField(name, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailValid = validateField("email", formData.email);
    const feedbackValid = validateField("feedback", formData.feedback);

    if (!emailValid || !feedbackValid) return;

    setStatus("sending");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({
          email: "",
          feedback: "",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };
  return (
    <form className={css.feedbackBox} onSubmit={handleSubmit}>
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
        />
        {errors.email && (
          <p className={css.error} id="email-error">
            {errors.email}
          </p>
        )}
      </div>
      <div className={css.inputContainer}>
        <textarea
          id="feedback"
          name="feedback"
          rows={6}
          placeholder="Your Feedback"
          value={formData.feedback}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={css.formMessage}
        ></textarea>
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
        >
          {status === "sending" ? "Sending..." : "Send"}
        </button>
      </div>

      {/* {status === "success" && (
      <p className={css.success}>Thank you! 🎉</p>
    )}
    {status === "error" && (
      <p className={css.error}>Something went wrong. 😢</p>
    )} */}
    </form>
  );
}
