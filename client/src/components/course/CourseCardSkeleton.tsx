export default function CourseCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border bg-white animate-pulse">
      <div className="w-full h-48 bg-gray-200" />

      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        <div className="h-3 bg-gray-200 rounded w-1/2" />

        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
