"use client";

import { useState } from "react";
import { FaCode, FaJava } from "react-icons/fa";
import { SiGithub, SiJavascript, SiPython } from "react-icons/si";
import Image from "next/image";
import css from "./footer.module.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feedback }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setFeedback("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };
  return (
    <footer>
      <div className={css.footerContainer}>
        <FaCode className={`${css.icon} ${css.spin} ${css.i1}`} />
        <SiJavascript className={`${css.icon} ${css.wiggle} ${css.i2}`} />
        <SiPython className={`${css.icon} ${css.floatReverse} ${css.i3}`} />
        <SiGithub className={`${css.icon} ${css.float} ${css.i4}`} />
        <FaJava className={`${css.icon} ${css.bounce} ${css.i5}`} />
        <div className={css.topFooter}>
          <Image
            aria-hidden
            src="/logo.png"
            alt="Logo CodeCraft"
            width={144}
            height={40}
            className={css.desctopLogo}
          />
          <h2 className={css.slogan}>
            <Image
              aria-hidden
              src="/logo.png"
              alt="Logo CodeCraft"
              width={144}
              height={40}
              className={css.smallLogo}
            />
            Transforming
            <br /> your
            <span> code </span> shape
            <br /> with us
          </h2>

          <form className={css.feedbackBox} onSubmit={handleSubmit}>
            <label htmlFor="feedback">
              Have feedback? Let&rsquo;s make CodeCraft better together.
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={css.formEmail}
            />
            <textarea
              id="feedback"
              name="feedback"
              rows={6}
              placeholder="Your Feedback"
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={css.formMessage}
            ></textarea>

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
        </div>
        <div className={css.copyright}>
          <p>&copy; 2025 CodeCraft. All rights reserved.</p>
          <a href="#">Privacy Policy / Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
