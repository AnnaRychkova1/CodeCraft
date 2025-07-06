"use client";

import { FaCode, FaJava } from "react-icons/fa";
import { SiGithub, SiJavascript, SiPython } from "react-icons/si";
import Image from "next/image";
import FeedbackForm from "../Forms/FeedbackForm/FeedbackForm";
import css from "./footer.module.css";

export default function Footer() {
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
          <FeedbackForm />
        </div>
        <div className={css.copyright}>
          <p>&copy; 2025 CodeCraft. All rights reserved.</p>
          <a href="#">Privacy Policy / Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
