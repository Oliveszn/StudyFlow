"use client";
import { links } from "@/config/navbar";
import Link from "next/link";
import { Button } from "../ui/button";
import SearchInput from "./SearchInput";
import Hamburger from "./svg-icons/Hamburger";
import Search from "./svg-icons/Search";
import MobileNav from "./MobileNav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import NavUserDropdown from "./NavUserDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  return (
    <nav
      className="st-header bg-background relative z-50 px-4 sm:px-6"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
        {/* Mobile Hamburger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div className="lg:hidden">
              <Hamburger />
            </div>
          </SheetTrigger>

          <SheetContent className="p-6">
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>
            <MobileNav />
          </SheetContent>
        </Sheet>

        {/* LOGO */}
        <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
          <Link
            href="/"
            aria-label="StudyFlow home"
            className="text-xl font-bold text-gray-900 hover:text-gray-700"
          >
            StudyFlow
          </Link>
        </div>

        <div
          className="hidden lg:flex items-center justify-end space-x-4 lg:space-x-8"
          role="navigation"
          aria-label="Primary"
        >
          {links.map((items) => (
            <Link
              key={items.name}
              href={items.link}
              aria-label={`Go to ${items.name}`}
              className="text-text-primary hover:bg-main-primary hover:text-main px-3 py-2 rounded-md transition-colors whitespace-nowrap"
            >
              {items.name}
            </Link>
          ))}

          <div role="search" aria-label="Site search">
            <SearchInput />
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          {/* <Link href="/auth/login" aria-label="Go to login page">
            <Button className="bg-white text-main hover:bg-main-primary py-2.5 px-4 rounded shadow-sm flex justify-center items-center border border-main cursor-pointer transition-colors">
              Log in
            </Button>
          </Link>

          <Link href="/auth/register" aria-label="Go to sign up page">
            <Button className="bg-main text-white hover:bg-main-foreground py-2.5 px-4 rounded shadow-sm flex justify-center items-center cursor-pointer">
              Sign Up
            </Button>
          </Link> */}
          {user ? (
            <NavUserDropdown
              firstName={user.firstName || "User"}
              lastName={user.lastName}
            />
          ) : (
            <>
              <Link href="/auth/login">
                <Button className="bg-white text-main hover:bg-main-primary py-2.5 px-4 rounded shadow-sm border border-main">
                  Log in
                </Button>
              </Link>

              <Link href="/auth/register">
                <Button className="bg-main text-white hover:bg-main-foreground py-2.5 px-4 rounded shadow-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
        {/* Search Icon */}
        <div className="lg:hidden flex items-center ml-auto">
          <button>
            <Search />
          </button>
        </div>
      </div>
    </nav>
  );
}
