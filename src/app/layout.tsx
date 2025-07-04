import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { Toaster } from "react-hot-toast";
import { ConfirmProvider } from "@/components/ConfirmModal/ConfirmModalContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfirmProvider>
          <div className={styles.page}>
            <Header />
            <Toaster />
            <main>{children}</main>
            <Footer />
          </div>
        </ConfirmProvider>
      </body>
    </html>
  );
}
