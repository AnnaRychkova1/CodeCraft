import Image from "next/image";
import {
  FaLaptopCode,
  FaTerminal,
  FaCode,
  FaPuzzlePiece,
  FaJava,
} from "react-icons/fa";
import { SiGithub, SiJavascript, SiPython } from "react-icons/si";
import css from "./hero.module.css";

export default function Hero() {
  return (
    <section className={css.heroSection}>
      <FaLaptopCode className={`${css.icon} ${css.float} ${css.i1}`} />
      <FaTerminal className={`${css.icon} ${css.wiggle} ${css.i2}`} />
      <FaCode className={`${css.icon} ${css.spin} ${css.i3}`} />
      <FaPuzzlePiece className={`${css.icon} ${css.bounce} ${css.i4}`} />
      <SiJavascript className={`${css.icon} ${css.wiggle} ${css.i5}`} />
      <SiGithub className={`${css.icon} ${css.spin} ${css.i6}`} />
      <SiPython className={`${css.icon} ${css.floatReverse} ${css.i7}`} />
      <FaJava className={`${css.icon} ${css.bounce} ${css.i8}`} />
      <div className={css.textContainer}>
        <h1>
          Challenge your brain.
          <br />
          <span className={css.animation}>Code your future.</span>
        </h1>
      </div>
      <div className={css.imgContainer}>
        <Image
          aria-hidden
          src="/coder-dark.png"
          alt="Logo CodeCraft"
          width={400}
          height={400}
        />
      </div>
    </section>
  );
}
