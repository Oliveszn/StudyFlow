"use client";

import { useCategories } from "@/hooks/endpoints/useCategories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function CategorySection() {
  const categoryImages = ["/cat1.webp", "/cat2.webp", "/cat3.webp"];
  const { data: categories = [], isPending } = useCategories();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(categories?.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/4">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
            Learn essential career and life skills
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            StudyFlow helps you build in-demand skills fast and advance your
            career in a changing job market.
          </p>

          <div className="flex gap-3">
            <button
              disabled={isPending}
              onClick={prevSlide}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              disabled={isPending}
              onClick={nextSlide}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

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

        <div className="w-full lg:w-3/4 overflow-hidden">
          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-84 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
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
                        (pageIndex + 1) * itemsPerPage,
                      )
                      .map((cat, i) => (
                        <Link
                          key={`${pageIndex}-${i}`}
                          href={`/categories/${cat.slug}`}
                          className="group cursor-pointer"
                        >
                          <div
                            className={`relative w-full h-84 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                            style={{
                              backgroundImage: `url(${categoryImages[i % 3]})`,
                              backgroundSize: "cover",
                              backgroundPosition: "50%",
                            }}
                          >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                            <h2 className="absolute top-6 left-6 text-white font-bold text-2xl drop-shadow-lg">
                              {cat.name}
                            </h2>
                            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-white text-sm font-semibold flex items-center gap-2">
                                Explore courses
                                <ChevronRight className="w-4 h-4" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
