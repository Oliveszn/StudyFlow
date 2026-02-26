"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, ShoppingCart, Star } from "lucide-react";
import { useRemoveFromWishlist } from "@/hooks/endpoints/student/useWishlist";
import { useEnrollInCourse } from "@/hooks/endpoints/student/useEnrollments";
import { WishlistItem } from "@/api/endpoints/student/wishlist";

// interface WishlistCourse {
//   id: string;
//   title: string;
//   thumbnail?: string;
//   instructor?: { name: string };
//   price?: number;
//   rating?: number;
//   reviewCount?: number;
//   level?: string;
// }

// export interface WishlistItem {
//   id: string;
//   course: WishlistCourse;
// }

interface Props {
  item: WishlistItem;
}

export default function WishlistCard({ item }: Props) {
  const router = useRouter();
  const { mutate: remove, isPending: removing } = useRemoveFromWishlist();
  const { mutate: enroll, isPending: enrolling } = useEnrollInCourse();

  const { course } = item;

  return (
    <div className="group flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
      <div
        onClick={() => router.push(`/courses/${course.id}`)}
        className="relative h-24 w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-white/5"
      >
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-indigo-900/40" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3
          onClick={() => router.push(`/courses/${course.id}`)}
          className="line-clamp-2 cursor-pointer text-sm font-semibold text-white/90 transition-colors hover:text-white"
        >
          {course.title}
        </h3>

        {course.instructor && (
          <p className="mt-1 text-xs text-white/35">
            {course.instructor.firstName}
          </p>
        )}

        {typeof course.averageRating === "number" && (
          <div className="mt-2 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">
              {course.averageRating.toFixed(1)}
            </span>
            {course.reviewCount && (
              <span className="text-xs text-white/30">
                ({course.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* {course.level && (
          <span className="mt-2 inline-block rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/40">
            {course.level}
          </span>
        )} */}
      </div>

      <div className="flex flex-shrink-0 flex-col items-end justify-between">
        {course.price !== undefined && (
          <span className="text-sm font-bold text-white">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => remove(course.id)}
            disabled={removing}
            title="Remove from wishlist"
            className="rounded-lg p-2 text-white/30 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => enroll(course.id)}
            disabled={enrolling}
            className="flex items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-60"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
}
