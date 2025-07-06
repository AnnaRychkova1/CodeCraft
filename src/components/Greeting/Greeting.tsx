"use client";
import { useSession } from "next-auth/react";
import { JSX } from "react";
import Loader from "../Loader/Loader";

export default function Greeting(): JSX.Element {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loader />;

  return <p>Hello {session?.user?.name || "Guest"}</p>;
}
