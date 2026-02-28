"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { links } from "@/config/navbar";
import { useAppSelector } from "@/store/hooks";

import { useLogout } from "@/hooks/endpoints/useAuth";
import { useCategories } from "@/hooks/endpoints/useCategories";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function MobileMenu() {
  const { user } = useAppSelector((state) => state.auth);
  const isInstructor = user?.role === "INSTRUCTOR";
  const { mutate, isPending } = useLogout();
  const { data: categories = [], isPending: catLoading } = useCategories();
  const [exploreOpen, setExploreOpen] = useState(false);
  const finalLinks = isInstructor
    ? [
        ...links.filter((item) => item.name !== "Teach on StudyFlow"),
        { name: "Instructor Dashboard", link: "/instructor/dashboard" },
      ]
    : links;

  return (
    <nav className="flex flex-col space-y-4 ">
      <div>
        <button
          onClick={() => setExploreOpen((prev) => !prev)}
          className="flex items-center justify-between w-full text-lg font-medium py-1"
          aria-expanded={exploreOpen}
        >
          {!catLoading && (
            <>
              <span>Explore</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  exploreOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>

        {/* Accordion content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            exploreOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col space-y-1 pl-3 border-l-2 border-gray-100">
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
        </div>
      </div>
      {finalLinks.map((item) => (
        <Link key={item.name} href={item.link} className="text-lg font-medium">
          {item.name}
        </Link>
      ))}

      {/* User Section */}
      <div className="border-t pt-4 mt-2 flex flex-col space-y-3">
        {user ? (
          <>
            {/* Hide My Learning for instructors */}
            {!isInstructor && (
              <Link href="/my-learning" className="text-lg font-medium">
                My Learning
              </Link>
            )}
            <Link href="/wishlist" className="text-lg font-medium">
              Wishlist
            </Link>
            <Link href="/profile" className="text-lg font-medium">
              Profile
            </Link>
            <Link href="/settings" className="text-lg font-medium">
              Settings
            </Link>
            <button
              onClick={() => mutate()}
              disabled={isPending}
              className="text-left text-red-600 text-lg font-medium"
            >
              {isPending ? "Logging out..." : "Log out"}
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <Button className="w-full">Log in</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="w-full bg-main text-white hover:bg-main-foreground">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
