"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState<number | null>(null);

  const router = useRouter();

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
        setLoginAttempts(0);
      } else {
        setBlockTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorPassword("");

    if (isBlocked) {
      toast.error(
        `Too many failed attempts. Please try again in ${minutes}:${seconds} minutes.`
      );
      return;
    }

    let hasError = false;
    if (!email.trim()) {
      setErrorEmail("Email is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorEmail("Invalid email");
      hasError = true;
    }

    if (!password.trim()) {
      setErrorPassword("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      toast.success("Login successful");
      localStorage.setItem("loginAttempts", "0");
      setLoginAttempts(0);
      router.push("/");
    } else {
      const updatedAttempts = loginAttempts + 1;
      setLoginAttempts(updatedAttempts);
      localStorage.setItem("loginAttempts", updatedAttempts.toString());

      if (updatedAttempts >= 3) {
        const blockUntil = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours
        localStorage.setItem("blockUntil", blockUntil.toISOString());
        setIsBlocked(true);
        setBlockTimeLeft(3 * 60 * 60 * 1000);
        toast.error("Too many failed attempts. Login is blocked for 3 hours.");
      } else {
        toast.error(
          `Login failed. You have ${3 - updatedAttempts} attempt(s) left.`
        );
      }
    }

    setIsSubmitting(false);
  };

  return (
    <section className="sectionAuth">
      <h2 className="title">Login</h2>
      {isBlocked && (
        <p className="accessWarning">
          Too many failed attempts. Please try again in {minutes}:{seconds}{" "}
          minutes.
        </p>
      )}
      <form onSubmit={handleLogin} noValidate>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorEmail && <p style={{ color: "red" }}>{errorEmail}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorPassword && <p style={{ color: "red" }}>{errorPassword}</p>}
        </div>

        <button type="submit" disabled={isSubmitting || isBlocked}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="redirectContainer">
        <p>Don&rsquo;t have an account?</p>
        <a className="redirectLink" href="/register">
          Register
        </a>
      </div>
    </section>
  );
}
