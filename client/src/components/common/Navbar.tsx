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
import { useCategories } from "@/hooks/endpoints/useCategories";
import { XIcon } from "lucide-react";
import { getInitials } from "@/helpers/getInitials";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const isInstructor = user?.role === "INSTRUCTOR";
  const { data: categories, isPending } = useCategories();

  // Since we filter first, add Instructor Dashboard manually for instructors
  const finalLinks = isInstructor
    ? [
        ...links.filter((item) => item.name !== "Teach on StudyFlow"),
        { name: "Instructor Dashboard", link: "/instructor/dashboard" },
      ]
    : links;

  const initials = getInitials(user?.firstName || "User", user?.lastName);
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

          <SheetContent className="p-6 lg:hidden" showCloseButton={false}>
            <button
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="absolute -left-16 top-6 size-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <XIcon className="w-5 h-5 text-gray-700" />
            </button>
            <SheetHeader className="">
              <SheetTitle className="-mx-4">
                <div className="bg-gray-200 flex items-center gap-4 -mx-6 px-6 py-4">
                  <Avatar className="cursor-pointer size-12">
                    <AvatarFallback className="bg-[#16161D] text-white text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="">
                    <h1 className="capitalize font-[500] text-[1.4rem] leading-tight tracking-normal text-[#3B2F4F]">
                      Hi, {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="capitalize text-[#6B5C84] font-[300] text-[1.1rem] ">
                      welcome back
                    </p>
                  </div>
                </div>
              </SheetTitle>
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
          <div className={`relative ${!isPending ? "group" : ""}`}>
            <button
              className="flex items-center gap-1 text-text-primary hover:bg-main-primary hover:text-main px-3 py-2 rounded-md transition-colors whitespace-nowrap"
              aria-haspopup="true"
            >
              {!isPending ? "Explore" : ""}
            </button>

            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {categories && (
                <ul className="py-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-main transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {finalLinks.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              aria-label={`Go to ${item.name}`}
              className="text-text-primary hover:bg-main-primary hover:text-main px-3 py-2 rounded-md transition-colors whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}

          <div role="search" aria-label="Site search">
            <SearchInput />
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <NavUserDropdown
              firstName={user.firstName || "User"}
              lastName={user.lastName}
              role={user.role}
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

        <div className="lg:hidden flex items-center ml-auto">
          <button>
            <Search />
          </button>
        </div>
      </div>
    </nav>
  );
}
