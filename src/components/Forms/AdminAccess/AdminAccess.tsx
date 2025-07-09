import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { getAdminAccess } from "@/services/admin";
import { useAdminAuth } from "@/components/Providers/AdminAuthProvider";
import Loader from "@/components/Loader/Loader";
import css from "./AdminAccess.module.css";

export default function AdminAccessForm() {
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAdminAttempts, setloginAdminAttempts] = useState(0);
  const { loginAdmin, sessionExpired, adminToken } = useAdminAuth();

  const minutes = Math.floor((blockTimeLeft || 0) / 60000);
  const seconds = Math.floor(((blockTimeLeft || 0) % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  useEffect(() => {
    const attempts = parseInt(
      localStorage.getItem("loginAdminAttempts") || "0"
    );
    const blockAdminUntil = localStorage.getItem("blockAdminUntil");

    if (blockAdminUntil && new Date(blockAdminUntil) > new Date()) {
      setIsBlocked(true);
      const timeLeft = new Date(blockAdminUntil).getTime() - Date.now();
      setBlockTimeLeft(timeLeft);
    } else {
      setIsBlocked(false);
      localStorage.removeItem("blockAdminUntil");
      setloginAdminAttempts(attempts);
    }
  }, []);

  useEffect(() => {
    if (!isBlocked || !blockTimeLeft) return;

    const interval = setInterval(() => {
      const blockAdminUntil = localStorage.getItem("blockAdminUntil");
      if (!blockAdminUntil) return;

      const timeLeft = new Date(blockAdminUntil).getTime() - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsBlocked(false);
        setBlockTimeLeft(null);
        localStorage.removeItem("blockAdminUntil");
        localStorage.setItem("loginAdminAttempts", "0");
      } else {
        setBlockTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorPassword("");
  };

  const handleFocus = () => {
    setErrorPassword("");
  };

  const handleBlur = () => {
    if (!password.trim()) {
      setErrorPassword("Password is required");
    } else if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters");
    } else {
      setErrorPassword("");
    }
  };

  const handleAccess = async () => {
    if (!password.trim()) {
      setErrorPassword("Password is required");
      return;
    }
    if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters");
      return;
    }

    setLoggingIn(true);

    if (isBlocked) {
      toast.error("Input is blocked. Please try again later.");
      setLoggingIn(false);
      return;
    }

    try {
      await getAdminAccess({ password });
      loginAdmin();
      localStorage.setItem("loginAdminAttempts", "0");
      setloginAdminAttempts(0);
      setPassword("");

      toast.success("Admin access granted");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please try again.";

      let updatedAttempts = loginAdminAttempts;

      if (message === "Wrong password") {
        updatedAttempts = loginAdminAttempts + 1;
        setloginAdminAttempts(updatedAttempts);
        localStorage.setItem("loginAdminAttempts", updatedAttempts.toString());
      }

      if (updatedAttempts >= 3) {
        const blockAdminUntil = new Date(Date.now() + 3 * 60 * 60 * 1000);
        localStorage.setItem("blockAdminUntil", blockAdminUntil.toISOString());
        setIsBlocked(true);
        setBlockTimeLeft(3 * 60 * 60 * 1000);
      }

      toast.error(
        message ||
          (updatedAttempts >= 3
            ? "Too many failed attempts. Input is blocked for 3 hours."
            : `Incorrect password. You have ${
                3 - updatedAttempts
              } attempt(s) left.`)
      );
    } finally {
      setLoggingIn(false);
    }
  };

  if (loggingIn) {
    return <Loader />;
  }

  return (
    <section className="sectionAuth">
      <h2 className="title">Admin Access</h2>
      {sessionExpired && adminToken && (
        <p className="accessWarning">Session expired. Please login again.</p>
      )}
      {isBlocked && (
        <p className="accessWarning">
          Too many failed attempts. Please try again in {minutes}:{seconds}{" "}
          minutes.
        </p>
      )}

      <div className={css.passwordWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          className={css.adminInput}
          disabled={isBlocked}
          onKeyDown={(e) => e.key === "Enter" && handleAccess()}
          autoFocus
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span
          className="eyeIcon"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
        {errorPassword && <p className={css.authError}>{errorPassword}</p>}
      </div>
      {loggingIn ? (
        <Loader />
      ) : (
        <div className={css.buttonAccessContainer}>
          <button
            onClick={handleAccess}
            className={`loginBtn ${css.accessBtn}`}
            disabled={loggingIn}
          >
            Get Access
          </button>
        </div>
      )}
    </section>
  );
}
