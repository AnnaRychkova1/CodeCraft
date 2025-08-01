import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { AdminAuthProvider } from "@/components/Providers/AdminAuthProvider";
import { AuthProvider } from "@/components/Providers/AuthProvider";
import { ConfirmProvider } from "@/components/Modals/ConfirmModal/ConfirmModal";
import "./globals.css";
import "./common.css";

const Header = dynamic(() => import("@/components/Header/Header"));
const Footer = dynamic(() => import("@/components/Footer/Footer"));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeCraft",
  description:
    "CodeCraft is a website for testing your programming language knowledge and practicing in JavaScript, Java, or Python.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("adminToken")?.value || null;
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="preconnect"
          href="https://code-craft-omega-eight.vercel.app"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AdminAuthProvider adminToken={adminToken}>
          <AuthProvider>
            <ConfirmProvider>
              <div className="page">
                <Header />
                <Toaster />
                <main>{children}</main>
                <Footer />
              </div>
            </ConfirmProvider>
          </AuthProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
