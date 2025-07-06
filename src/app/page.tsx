"use client";

import Greeting from "@/components/Greeting/Greeting";
import Hero from "@/components/Hero/Hero";
import Tasks from "@/components/Tasks/Tasks";

export default function Home() {
  return (
    <>
      <Greeting />
      <Hero />
      <Tasks />
    </>
  );
}
