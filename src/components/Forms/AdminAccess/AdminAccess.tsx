import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AdminAccessFormProps } from "@/types/types";
import { getAdminAccess } from "@/services/tasks";
import { useAdminAuth } from "@/context/AdminAuthContext";
import Loader from "@/components/Loader/Loader";
import css from "./adminaccess.module.css";

export default function AdminAccessForm({
  sessionExpired,
  setSessionExpired,
}: AdminAccessFormProps) {
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const { loginAdmin } = useAdminAuth();

  const minutes = Math.floor((blockTimeLeft || 0) / 60000);
  const seconds = Math.floor(((blockTimeLeft || 0) % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  useEffect(() => {
    const attempts = parseInt(localStorage.getItem("loginAttempts") || "0");
    const blockUntil = localStorage.getItem("blockUntil");

    if (blockUntil && new Date(blockUntil) > new Date()) {
      setIsBlocked(true);
      const timeLeft = new Date(blockUntil).getTime() - Date.now();
      setBlockTimeLeft(timeLeft);
    } else {
      setIsBlocked(false);
      localStorage.removeItem("blockUntil");
      setLoginAttempts(attempts);
    }
  }, []);

  useEffect(() => {
    if (!isBlocked || !blockTimeLeft) return;

    const interval = setInterval(() => {
      const blockUntil = localStorage.getItem("blockUntil");
      if (!blockUntil) return;

      const timeLeft = new Date(blockUntil).getTime() - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsBlocked(false);
        setBlockTimeLeft(null);
        localStorage.removeItem("blockUntil");
        localStorage.setItem("loginAttempts", "0");
      } else {
        setBlockTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  const handleAccess = async () => {
    if (!password.trim()) {
      toast.error("Password cannot be empty");
      return;
    }
    setLoggingIn(true);

    if (isBlocked) {
      toast.error("Input is blocked. Please try again later.");
      setLoggingIn(false);
      return;
    }

    try {
      const adminToken = await getAdminAccess(password);
      localStorage.setItem("adminToken", adminToken);
      loginAdmin(adminToken);
      localStorage.setItem("loginAttempts", "0");
      setLoginAttempts(0);
      setPassword("");
      setSessionExpired(false);
      toast.success("Admin access granted");
    } catch {
      const updatedAttempts = loginAttempts + 1;
      setLoginAttempts(updatedAttempts);
      localStorage.setItem("loginAttempts", updatedAttempts.toString());

      if (updatedAttempts >= 3) {
        const blockUntil = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours
        localStorage.setItem("blockUntil", blockUntil.toISOString());
        setIsBlocked(true);
        setBlockTimeLeft(3 * 60 * 60 * 1000);
        toast.error("Too many failed attempts. Input is blocked for 3 hours.");
      } else {
        toast.error(
          `Incorrect password. You have ${3 - updatedAttempts} attempt(s) left.`
        );
      }
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <section className="sectionAuth">
      <h2 className="title">Admin Access</h2>
      {sessionExpired && (
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
          onChange={(e) => setPassword(e.target.value)}
          className={css.adminInput}
          disabled={isBlocked}
          onKeyDown={(e) => e.key === "Enter" && handleAccess()}
        />
        <span
          className="eyeIcon"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
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
