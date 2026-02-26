"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import WishlistGrid from "@/components/student/wishlist/WishlistGrid";
import { useWishlist } from "@/hooks/endpoints/student/useWishlist";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white">
      <div className="sticky top-0 z-10 border-b border-white/5 bg-[#0e0e11]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-5">
          <Heart className="h-5 w-5 text-rose-400" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Wishlist</h1>
            <p className="mt-0.5 text-sm text-white/40">
              {wishlist?.pagination.total ?? 0} saved course
              {(wishlist?.pagination.total ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
          </div>
        ) : !wishlist?.data?.length ? (
          <div className="space-y-4 py-24 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10">
              <Heart className="h-9 w-9 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
              <p className="mt-1 text-sm text-white/40">
                Browse courses and save ones you&apos;re interested in.
              </p>
            </div>
          </div>
        ) : (
          <WishlistGrid items={wishlist.data} />
        )}
      </div>
    </div>
  );
}
