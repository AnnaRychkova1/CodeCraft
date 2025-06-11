import Image from "next/image";
import css from "./header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <Image
        aria-hidden
        src="/logo.png"
        alt="Logo CodeCraft"
        className={css.logo}
        width={144}
        height={40}
      />
      <span className={css.slogan}>
        Built by devs, for devs. Learn, practice, and grow with CodeCraft.
      </span>
      <Image
        aria-hidden
        src="/coder.png"
        alt="Coder CodeCraft"
        className={css.avatar}
        width={40}
        height={40}
      />
    </header>
  );
}
