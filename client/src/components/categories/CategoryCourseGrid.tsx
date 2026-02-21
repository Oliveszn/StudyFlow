import CourseCard from "../course/CourseCard";
import CourseCardSkeleton from "../course/CourseCardSkeleton";

interface Props {
  loading: boolean;
  courses: any[];
}

export default function CategoryCourseGrid({ loading, courses }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!courses.length) {
    return <p>No courses found.</p>;
  }
  console.log(courses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
