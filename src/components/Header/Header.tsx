"use client";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import css from "./header.module.css";

export default function Header() {
  const { userToken, logoutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const hideAuthButtons = ["/login", "/register", "/admin"].includes(
    pathname as string
  );

  const handleLogin = () => {
    router.push("/login");
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
            {userToken ? (
              <button onClick={logoutUser} className="logoutBtn">
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
          {userToken ? (
            <button onClick={logoutUser} className="logoutBtn">
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
