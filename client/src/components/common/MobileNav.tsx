"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { links } from "@/config/navbar";

export default function MobileMenu() {
  return (
    <nav className="flex flex-col space-y-4 mt-6">
      {links.map((item) => (
        <Link key={item.name} href={item.link} className="text-lg font-medium">
          {item.name}
        </Link>
      ))}

      <div className="mt-6 flex flex-col space-y-2">
        <Link href="/auth/login">
          <Button className="w-full">Log in</Button>
        </Link>
        <Link href="/auth/register">
          <Button className="w-full bg-main text-white hover:bg-main-foreground">
            Sign Up
          </Button>
        </Link>
      </div>
    </nav>
  );
}
