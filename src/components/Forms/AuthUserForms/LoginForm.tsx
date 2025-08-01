"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import type { LoginUserDto } from "@/types/userTypes";
import Loader from "@/components/Loader/Loader";
import css from "./AuthForms.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginUserAttempts, setLoginUserAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState<number | null>(null);

  const router = useRouter();

  type FieldName = "email" | "password";

  const getValidationError = (name: FieldName, value: string): string => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        return "";
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const errorSetters: Record<FieldName, (msg: string) => void> = {
    email: setErrorEmail,
    password: setErrorPassword,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: FieldName; value: string };

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as { name: FieldName };
    errorSetters[name]("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: FieldName; value: string };
    const error = getValidationError(name, value);
    errorSetters[name](error);
  };

  const validateAllFields = () => {
    const emailError = getValidationError("email", email);
    const passwordError = getValidationError("password", password);

    setErrorEmail(emailError);
    setErrorPassword(passwordError);

    return !(emailError || passwordError);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    if (isBlocked) {
      const minutes = Math.floor((blockTimeLeft || 0) / 60000);
      const seconds = Math.floor(((blockTimeLeft || 0) % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      toast.error(
        `Too many failed attempts. Please try again in ${minutes}:${seconds} minutes.`
      );
      setIsSubmitting(false);
      return;
    }
    try {
      const loginData: LoginUserDto = { email, password };
      const res = (await signIn("credentials", {
        redirect: false,
        ...loginData,
      })) as { ok?: boolean; error?: string };

      if (res?.ok) {
        toast.success("Login successful");
        localStorage.setItem("loginUserAttempts", "0");
        setLoginUserAttempts(0);
        router.push("/");
      } else {
        const message = res?.error || "Login failed";

        let updatedAttempts = loginUserAttempts;

        if (message === "Wrong password") {
          updatedAttempts = loginUserAttempts + 1;
          setLoginUserAttempts(updatedAttempts);
          localStorage.setItem("loginUserAttempts", updatedAttempts.toString());
        }

        if (updatedAttempts >= 3) {
          const blockUntil = new Date(Date.now() + 3 * 60 * 60 * 1000);
          localStorage.setItem("blockUserUntil", blockUntil.toISOString());
          setIsBlocked(true);
          setBlockTimeLeft(3 * 60 * 60 * 1000);
          toast.error(
            "Too many failed attempts. Login is blocked for 3 hours."
          );
        } else {
          toast.error(message || "Something went wrong. Please try again.");
        }
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "An unexpected error occurred during login."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const attempts = parseInt(localStorage.getItem("loginUserAttempts") || "0");
    const blockUserUntil = localStorage.getItem("blockUserUntil");

    if (blockUserUntil && new Date(blockUserUntil) > new Date()) {
      setIsBlocked(true);
      const timeLeft = new Date(blockUserUntil).getTime() - Date.now();
      setBlockTimeLeft(timeLeft);
    } else {
      setIsBlocked(false);
      localStorage.removeItem("blockUserUntil");
      setLoginUserAttempts(attempts);
    }
  }, []);

  useEffect(() => {
    if (!isBlocked || !blockTimeLeft) return;

    const interval = setInterval(() => {
      const blockUserUntil = localStorage.getItem("blockUserUntil");
      if (!blockUserUntil) return;

      const timeLeft = new Date(blockUserUntil).getTime() - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsBlocked(false);
        setBlockTimeLeft(null);
        localStorage.removeItem("blockUserUntil");
        localStorage.setItem("loginUserAttempts", "0");
        setLoginUserAttempts(0);
      } else {
        setBlockTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  const minutes = Math.floor((blockTimeLeft || 0) / 60000);
  const seconds = Math.floor(((blockTimeLeft || 0) % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  return (
    <>
      {isBlocked && (
        <p className="accessWarning">
          Too many failed attempts. Please try again in {minutes}:{seconds}{" "}
          minutes.
        </p>
      )}
      <form className={css.authForm} onSubmit={handleLogin} noValidate>
        <fieldset className={css.inputField}>
          <label htmlFor="loginEmail" className={css.authLabel}>
            Email
          </label>
          <input
            id="loginEmail"
            name="email"
            type="email"
            value={email}
            placeholder="Your Email"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={css.authInput}
            aria-invalid={!!errorEmail}
            aria-describedby={errorEmail ? "email-error" : undefined}
            autoComplete="off"
            required
            disabled={isSubmitting}
          />
          {errorEmail && <p className={css.authError}>{errorEmail}</p>}
        </fieldset>

        <fieldset className={css.inputField}>
          <label htmlFor="loginPassword" className={css.authLabel}>
            Password
          </label>
          <input
            id="loginPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Enter your password"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={css.authInput}
            aria-invalid={!!errorPassword}
            aria-describedby={errorPassword ? "password-error" : undefined}
            autoComplete="off"
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            className={`eyeIcon ${css.authIcon}`}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          {errorPassword && <p className={css.authError}>{errorPassword}</p>}
        </fieldset>

        <div className={css.authBtnContainer}>
          {isSubmitting ? (
            <Loader />
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || isBlocked}
              className={`loginBtn ${css.authBtn}`}
              aria-label="Login"
            >
              Login
            </button>
          )}
        </div>
      </form>
    </>
  );
}
