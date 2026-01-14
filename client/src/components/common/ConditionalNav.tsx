"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/instructor")) {
    return null;
  }

  return <Navbar />;
}
