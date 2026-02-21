"use client";

import { Search } from "lucide-react";

interface CoursesPageHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  total?: number;
  isLoading: boolean;
}

export default function CoursesPageHeader({
  search,
  onSearchChange,
  total,
  isLoading,
}: CoursesPageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">All Courses</h1>
        <p className="text-gray-500 mb-6">
          {isLoading
            ? "Loading courses..."
            : total !== undefined
              ? `${total.toLocaleString()} course${total !== 1 ? "s" : ""} available`
              : "Browse our full catalog"}
        </p>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>
    </div>
  );
}
