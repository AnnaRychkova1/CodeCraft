"use client";
import { toast } from "react-hot-toast";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { removeAdminAccess } from "@/services/admin";
import { useAdminAuth } from "@/components/Providers/AdminAuthProvider";
import { useConfirm } from "../Modals/ConfirmModal/ConfirmModal";
import css from "./Header.module.css";

const UserProgressModal = dynamic(
  () => import("../Modals/UserProgressModal/UserProgressModal")
);

export default function Header() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { logoutAdmin, isAdminVerified } = useAdminAuth();

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

  const handleLogoutAdmin = () => {
    confirm({
      message: "Are you sure you want to log out?",
      onConfirm: async () => {
        try {
          await removeAdminAccess();
          logoutAdmin();
          toast.success("Logged out successfully");
          router.push("/");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to logout");
        }
      },
    });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <header className={css.header}>
        <div className={css.logoContainer}>
          <Image
            aria-hidden
            src="/logo.png"
            alt="Logo CodeCraft"
            className={css.logo}
            width={144}
            height={40}
            priority
          />
          {isClient && isAdminVerified && (
            <div className={css.adminTopContainer}>
              <button
                type="button"
                onClick={handleLogoutAdmin}
                className="logoutBtn"
                aria-label="Logout as admin"
              >
                Logout
              </button>
            </div>
          )}
          {!hideAuthButtons && (
            <div className={css.authTopContainer}>
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    className={css.profileBtn}
                    onClick={() => setIsModalOpen(true)}
                    aria-label="Open user profile modal"
                  >
                    <Image
                      aria-hidden
                      src="/coder.png"
                      alt="Coder CodeCraft"
                      width={40}
                      height={40}
                      priority
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="logoutBtn"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="loginBtn"
                  aria-label="Login"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
        <div className={css.sloganContainer}>
          <div className={css.sloganBox}>
            <span className={css.slogan}>
              Built by devs, for devs. Learn, practice, and grow with CodeCraft.
            </span>
          </div>
        </div>

        {isClient && isAdminVerified && (
          <div className={css.adminContainer}>
            <button
              type="button"
              onClick={handleLogoutAdmin}
              className="logoutBtn"
              aria-label="Logout as admin"
            >
              Logout
            </button>
          </div>
        )}
        {!hideAuthButtons && (
          <div className={css.authContainer}>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className={css.profileBtn}
                  onClick={() => setIsModalOpen(true)}
                  aria-label="Open user profile modal"
                >
                  <Image
                    aria-hidden
                    src="/coder.png"
                    alt="Coder CodeCraft"
                    className={css.avatar}
                    width={40}
                    height={40}
                    priority
                  />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="logoutBtn"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="loginBtn"
                aria-label="Login"
              >
                Login
              </button>
            )}
          </div>
        )}
      </header>
      {isAuthenticated && (
        <UserProgressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
