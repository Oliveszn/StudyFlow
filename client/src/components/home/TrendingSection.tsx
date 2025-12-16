import { Star, StarHalf } from "lucide-react";

export default function TrendingSection() {
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp 2024",
      instructor: "Angela Yu",
      rating: 4.7,
      reviewCount: 245890,
      price: 84.99,
      discountPrice: 12.99,
      bestseller: true,
    },
    {
      id: 2,
      title: "The Complete JavaScript Course 2024: From Zero to Expert!",
      instructor: "Jonas Schmedtmann",
      rating: 4.8,
      reviewCount: 189234,
      price: 89.99,
      discountPrice: 13.99,
      bestseller: true,
    },
    {
      id: 3,
      title: "React - The Complete Guide 2024 (incl. React Router & Redux)",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.6,
      reviewCount: 156789,
      price: 94.99,
      discountPrice: 14.99,
      bestseller: true,
    },
    {
      id: 4,
      title: "Python for Data Science and Machine Learning Bootcamp",
      instructor: "Jose Portilla",
      rating: 4.7,
      reviewCount: 198456,
      price: 79.99,
      discountPrice: 11.99,
      bestseller: false,
    },
    {
      id: 5,
      title: "AWS Certified Solutions Architect - Associate 2024",
      instructor: "Stephane Maarek",
      rating: 4.8,
      reviewCount: 234567,
      price: 99.99,
      discountPrice: 15.99,
      bestseller: true,
    },
    {
      id: 6,
      title: "The Complete Digital Marketing Course - 12 Courses in 1",
      instructor: "Rob Percival",
      rating: 4.5,
      reviewCount: 123456,
      price: 89.99,
      discountPrice: 13.99,
      bestseller: false,
    },
  ];

  const renderStars = (rating: any) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    return stars;
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Trending Courses
          </h2>
          <p className="text-gray-600">
            Most popular courses among learners this week
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            >
              {/* Course Image Skeleton */}
              <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-400 rounded-lg opacity-50"></div>
                </div>
                {course.bestseller && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                      Bestseller
                    </span>
                  </div>
                )}
              </div>

              {/* Course Details */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>

                {/* Instructor */}
                <p className="text-sm text-gray-600 mb-2">
                  {course.instructor}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900 text-sm">
                    {course.rating}
                  </span>
                  <div className="flex items-center">
                    {renderStars(course.rating)}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({course.reviewCount.toLocaleString()})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-lg">
                    ${course.discountPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${course.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
