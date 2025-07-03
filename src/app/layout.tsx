import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { ConfirmProvider } from "@/components/ConfirmModal/ConfirmModalContext";
import "./globals.css";
import "./common.css";

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
  const userToken = cookieStore.get("userToken")?.value || null;
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AdminAuthProvider adminToken={adminToken}>
          <AuthProvider userToken={userToken}>
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
