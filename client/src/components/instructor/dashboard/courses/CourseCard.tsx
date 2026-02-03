import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  isPublished: boolean;
}

export default function CourseCard({
  id,
  title,
  slug,
  thumbnail,
  isPublished,
}: CourseCardProps) {
  return (
    <div className="border border-black rounded-lg p-4 flex items-center justify-between gap-4">
      <img
        src={thumbnail}
        alt={title}
        className="w-24 h-16 object-cover rounded-md"
      />

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span
          className={`text-sm font-medium uppercase ${
            isPublished ? "text-green-600" : "text-gray-600"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </div>

      <Link
        href={`/instructor/dashboard/courses/${id}`}
        className="text-blue-600 hover:underline ml-auto"
      >
        Edit / Manage Course
      </Link>
    </div>
  );
}
