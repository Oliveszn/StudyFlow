"use client";
import { useState } from "react";
import Search from "./svg-icons/Search";

export default function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <div
      className="search-bar bg-background relative w-[450px]"
      role="search"
      aria-label="Site search"
    >
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg> */}
        <Search />
      </span>
      <input
        name="q"
        data-testid="search-input"
        placeholder="Search for anything"
        type="text"
        className="w-full pl-10 pr-4 py-2.5 rounded-full text-[15px] focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent placeholder:text-gray-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search for courses"
        aria-autocomplete="list"
        aria-expanded="false"
        aria-controls="search-suggestions"
        aria-invalid="false"
        autoComplete="off"
      />

      {/* dropdown suggestion container */}
      {/* <div
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className="hidden"
        /> */}
    </div>
  );
}
