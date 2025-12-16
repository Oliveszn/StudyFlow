"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CategorySection() {
  const categories = [
    {
      title: "Web Development",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      title: "Finance",
      color: "bg-gradient-to-br from-green-500 to-green-700",
    },
    {
      title: "Music",
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
    },
    {
      title: "AI Development",
      color: "bg-gradient-to-br from-pink-500 to-pink-700",
    },
    {
      title: "Data Science",
      color: "bg-gradient-to-br from-orange-500 to-orange-700",
    },
    {
      title: "Machine Learning",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    },
    {
      title: "Mobile Development",
      color: "bg-gradient-to-br from-red-500 to-red-700",
    },
    {
      title: "Cloud Computing",
      color: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    },
    {
      title: "UI/UX Design",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-700",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left – 25% */}
        <div className="w-full lg:w-1/4">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
            Learn essential career and life skills
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            StudyFlow helps you build in-demand skills fast and advance your
            career in a changing job market.
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right – 75% Carousel */}
        <div className="w-full lg:w-3/4 overflow-hidden">
          <div className="relative">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {categories
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage
                    )
                    .map((cat, i) => (
                      <div
                        key={`${pageIndex}-${i}`}
                        className="group cursor-pointer"
                      >
                        <div
                          className={`relative w-full h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${cat.color}`}
                        >
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                          <h2 className="absolute top-6 left-6 text-white font-bold text-2xl drop-shadow-lg">
                            {cat.title}
                          </h2>
                          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white text-sm font-semibold flex items-center gap-2">
                              Explore courses
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
