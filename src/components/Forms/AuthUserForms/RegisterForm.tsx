"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import type { RegisterUserDto } from "@/types/user";
import { registerUser } from "@/services/user";
import Loader from "@/components/Loader/Loader";
import css from "./authForms.module.css";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  type FieldName = "name" | "email" | "password";

  const errorSetters: Record<FieldName, (msg: string) => void> = {
    name: setErrorName,
    email: setErrorEmail,
    password: setErrorPassword,
  };

  const getValidationError = (name: FieldName, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: FieldName; value: string };
    const error = getValidationError(name, value);
    errorSetters[name](error);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as { name: FieldName };
    errorSetters[name]("");
  };

  const validateAllFields = () => {
    const nameError = getValidationError("name", name);
    const emailError = getValidationError("email", email);
    const passwordError = getValidationError("password", password);

    setErrorName(nameError);
    setErrorEmail(emailError);
    setErrorPassword(passwordError);

    return !(nameError || emailError || passwordError);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      toast.error("Please fill out all fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData: RegisterUserDto = { name, email, password };

      const response = await registerUser(userData);

      toast.success(response.message || "Registered successfully");

      const loginResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginResult?.error) {
        toast.error("Login failed after registration");
      } else {
        toast.success("Logged in successfully");

        router.push("/");
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.authForm} onSubmit={handleRegister} noValidate>
      <fieldset className={css.inputField}>
        <label htmlFor="userName" className={css.authLabel}>
          Name
        </label>
        <input
          id="userName"
          name="name"
          type="text"
          value={name}
          placeholder="Your Name"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={css.authInput}
          aria-invalid={!!errorName}
          aria-describedby={errorName ? "name-error" : undefined}
          autoComplete="off"
          required
          disabled={isSubmitting}
        />
        {errorName && <p className={css.authError}>{errorName}</p>}
      </fieldset>

      <fieldset className={css.inputField}>
        <label htmlFor="registerEmail" className={css.authLabel}>
          Email
        </label>
        <input
          id="registerEmail"
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
        <label htmlFor="registerPassword" className={css.authLabel}>
          Password
        </label>
        <input
          id="registerPassword"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="Create a password"
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
        <span
          className={`eyeIcon ${css.authIcon}`}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
        {errorPassword && <p className={css.authError}>{errorPassword}</p>}
      </fieldset>

      <div className={css.authBtnContainer}>
        {isSubmitting ? (
          <Loader />
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`loginBtn ${css.authBtn}`}
          >
            Register
          </button>
        )}
      </div>
    </form>
  );
}
