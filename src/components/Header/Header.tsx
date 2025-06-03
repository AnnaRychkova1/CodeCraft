import Image from "next/image";
import css from "./header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <Image
        aria-hidden
        src="/logo.png"
        alt="Logo CodeCraft"
        width={144}
        height={40}
      />
      <span className={css.slogan}>Learn. Test. Improve.</span>
      <Image
        aria-hidden
        src="/coder.png"
        alt="Coder CodeCraft"
        width={40}
        height={40}
      />
    </header>
  );
}
