import CourseCard from "./CourseCard";

interface CoursesListProps {
  courses: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnail?: string;
    isPublished: boolean;
  }>;
}

export default function CoursesList({ courses }: CoursesListProps) {
  if (courses.length === 0)
    return <p className="text-center font-medium text-lg">No courses found</p>;

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}
