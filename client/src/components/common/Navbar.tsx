import { links } from "@/config/navbar";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="st-header bg-background">
      <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex-shrink-0 cursor-pointer">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-gray-700"
          >
            {/* <StagePassLogo size="small" /> */}
            StudyFlow
          </Link>
        </div>

        <div className="hidden lg:flex items-center justify-end space-x-4 lg:space-x-8">
          {links.map((items) => (
            <Link
              key={items.name}
              href={items.link}
              className="text-gray-700 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              {items.name}
            </Link>
          ))}

          {/* search button */}
          <button
            className="cursor-pointer"
            // onClick={() => setSearchModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded shadow-lg flex justify-center items-center w-24">
              Login
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          {/* <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6 text-gray-700"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button> */}
        </div>
      </div>
    </nav>
  );
}
