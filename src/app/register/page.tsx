"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorName("");
    setErrorEmail("");
    setErrorPassword("");

    let hasError = false;
    if (!name.trim()) {
      setErrorName("Name is required");
      hasError = true;
    }

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
    } else if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registered successfully");

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(
        `${err instanceof Error ? err.message : String(err)}` ||
          "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="sectionAuth">
      <h2 className="title">Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errorName && <p style={{ color: "red" }}>{errorName}</p>}
        </div>

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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="redirectContainer">
        <p>Already have an account?</p>
        <a className="redirectLink" href="/login">
          Login
        </a>
      </div>
    </section>
  );
}
