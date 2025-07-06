"use client";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useConfirm } from "../Modals/ConfirmModal/ConfirmModal";
import css from "./header.module.css";

export default function Header() {
  const { status } = useSession();
  const isUser = status === "authenticated";

  const router = useRouter();
  const pathname = usePathname();
  const confirm = useConfirm();

  const hideAuthButtons = ["/login", "/register", "/admin"].includes(
    pathname as string
  );

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    confirm({
      message: "Are you sure you want to log out?",
      onConfirm: () => signOut(),
    });
  };

  return (
    <header className={css.header}>
      <div className={css.logoContainer}>
        <Image
          aria-hidden
          src="/logo.png"
          alt="Logo CodeCraft"
          className={css.logo}
          width={144}
          height={40}
        />
        {!hideAuthButtons && (
          <div className={css.authTopContainer}>
            <Image
              aria-hidden
              src="/coder.png"
              alt="Coder CodeCraft"
              width={40}
              height={40}
            />
            {isUser ? (
              <button onClick={() => signOut()} className="logoutBtn">
                Logout
              </button>
            ) : (
              <button onClick={handleLogin} className="loginBtn">
                Login
              </button>
            )}
          </div>
        )}
      </div>
      <div className={css.sloganContainer}>
        <span className={css.slogan}>
          Built by devs, for devs. Learn, practice, and grow with CodeCraft.
        </span>
      </div>
      {!hideAuthButtons && (
        <div className={css.authContainer}>
          <Image
            aria-hidden
            src="/coder.png"
            alt="Coder CodeCraft"
            className={css.avatar}
            width={40}
            height={40}
          />
          {isUser ? (
            <button onClick={handleLogout} className="logoutBtn">
              Logout
            </button>
          ) : (
            <button onClick={handleLogin} className="loginBtn">
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}
