"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/Loader/Loader";

const Hero = dynamic(() => import("@/components/Hero/Hero"));
const Tasks = dynamic(() => import("@/components/Tasks/Tasks"), {
  loading: () => <Loader />,
});

export default function Home() {
  return (
    <>
      <Hero />
      <Tasks />
    </>
  );
}
